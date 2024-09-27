import { Component, Input, SimpleChanges } from '@angular/core';
import { Course } from '../../../models/course.model';
import { StudentService } from '../../../services/student.service';
import { ToastrService } from 'ngx-toastr';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Exam } from '../../../models/exam.model';
import { IFinalGradeData } from '../../../models/student.model';

@UntilDestroy()
@Component({
  selector: 'app-final-grades-table',
  templateUrl: './final-grades-table.component.html',
  styleUrl: './final-grades-table.component.scss',
})
export class FinalGradesTableComponent {
  @Input() course: Course | undefined;

  exam: Exam | undefined = undefined;
  dataSource: any[] = [];
  displayedColumns: string[] = [
    'id',
    'name',
    'assignmentsAverage',
    'finalExamGrade',
    'finalGrade',
  ];
  isLoading = false;

  constructor(
    private _studentSvc: StudentService,
    private _toastr: ToastrService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['course'] && this.course) {
      this.isLoading = true;
      this.exam = this.course.finalExam;
      this.loadStudentsData();
    }
  }

  loadStudentsData(): void {
    if (!this.course) return;

    this.isLoading = true;

    this._studentSvc
      .getStudentsByCourseId(this.course.id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (students) => {
          this.dataSource = students.map((student: any) => {
            const examSubmission = student.assignmentsSubmissions.find(
              (submission: any) => submission.assignmentId === this.exam?.id
            );
            const finalExamGrade = examSubmission?.grade || 0;

            const assignmentsAverage = this.calculateAssignmentsAverage(
              student,
              this.exam?.id || ''
            );

            const finalGrade = this.calculateFinalGrade(
              assignmentsAverage,
              finalExamGrade
            );

            return {
              id: student.studentId,
              name: `${student.firstName} ${student.lastName}`,
              assignmentsAverage,
              finalExamGrade,
              finalGrade,
            };
          });
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err);
        },
      });
  }

  calculateAssignmentsAverage(student: any, examId: string): number {
    const nonExamAssignments =
      this.course?.assignments?.filter(
        (assignmentId: string) => assignmentId !== examId
      ) || [];

    if (nonExamAssignments.length === 0) {
      return 0;
    }

    let totalGrade = 0;
    let count = 0;

    nonExamAssignments.forEach((assignmentId: string) => {
      const submission = student.assignmentsSubmissions.find(
        (sub: any) => sub.assignmentId === assignmentId
      );

      const grade =
        submission &&
        submission.grade !== null &&
        submission.grade !== undefined
          ? submission.grade
          : 0;

      totalGrade += grade;
      count++;
    });

    return totalGrade / count;
  }

  calculateFinalGrade(
    assignmentsAverage: number,
    finalExamGrade: number
  ): number {
    const assignmentWeight = this.course?.assignmentWeight || 0;
    const finalExamWeight = this.course?.finalExamWeight || 0;

    return (
      (assignmentsAverage * assignmentWeight) / 100 +
      (finalExamGrade * finalExamWeight) / 100
    );
  }

  onSubmitFinalGrades(): void {
    if (!this.course?.id) {
      return;
    }

    const finalGradesData: IFinalGradeData[] = this.dataSource.map(
      (student) => ({
        studentId: student.id,
        courseId: this.course!.id,
        finalGradeValue: student.finalGrade,
      })
    );

    this.isLoading = true;

    this._studentSvc
      .submitFinalGrades(finalGradesData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this._toastr.success(res.message);
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err);
        },
      });
  }
}
