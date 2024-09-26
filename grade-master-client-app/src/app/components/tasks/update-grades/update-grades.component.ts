import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from '../../../services/student.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ITaskStudentData } from '../../../models/student.model';
import { AssignmentSubmissionService } from '../../../services/assignment-submission.service';
import { IAssignmentSubmission } from '../../../models/assignment.model';
import { ToastrService } from 'ngx-toastr';

@UntilDestroy()
@Component({
  selector: 'app-update-grades',
  templateUrl: './update-grades.component.html',
  styleUrl: './update-grades.component.scss',
})
export class UpdateGradesComponent implements OnInit {
  taskId: string | null = null;
  courseId: string | null = null;
  students: ITaskStudentData[] = [];
  searchTerm: string = '';
  isLoading!: boolean;
  isSubmitting: { [key: string]: boolean } = {};

  constructor(
    private _studentSvc: StudentService,
    private _assignmentSubmissionSvc: AssignmentSubmissionService,
    private _route: ActivatedRoute,
    private _toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.taskId = this._route.snapshot.paramMap.get('taskId');
    this.courseId = this._route.snapshot.paramMap.get('courseId');
    this.loadData();
  }

  loadData(): void {
    if (!this.taskId || !this.courseId) return;
    this.isLoading = true;
    this._studentSvc
      .getStudentsByCourseId(this.courseId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res) => {
          this.students = res.map((student) => {
            const studentAssignment = student.assignmentsSubmissions.find(
              (submission: any) => submission.assignmentId === this.taskId
            );

            return {
              id: student.id,
              firstName: student.firstName,
              lastName: student.lastName,
              studentId: student.studentId,
              assignmentSubmission: studentAssignment || {
                assignmentId: this.taskId,
                studentId: student.id,
                grade: null,
                feedback: '',
              },
            };
          });
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err);
        },
      });
  }

  get filteredStudents(): ITaskStudentData[] {
    const term = this.searchTerm.toLowerCase();

    const filtered = this.students.filter(
      (student) =>
        student.firstName.toLowerCase().includes(term) ||
        student.lastName.toLowerCase().includes(term) ||
        student.studentId.toString().toLowerCase().includes(term)
    );

    // sort the filtered students by last name
    return filtered.sort((a, b) => {
      const nameA = a.lastName.toLowerCase();
      const nameB = b.lastName.toLowerCase();

      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  }

  submitStudent(student: ITaskStudentData): void {
    const submission = student.assignmentSubmission;
    if (
      submission.grade == null ||
      submission.grade < 0 ||
      submission.grade > 100
    ) {
      this._toastr.error('Grade is required and must be between 0 and 100');
      return;
    }
    this.isSubmitting[student.id] = true;

    if (!submission.id) {
      const newSubmission: IAssignmentSubmission = {
        assignmentId: this.taskId,
        studentId: student.id,
        grade: submission.grade,
        feedback: submission.feedback,
      };

      this._assignmentSubmissionSvc
        .addNewAssignmentSubmission(student.id, newSubmission)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (response) => {
            student.assignmentSubmission.id = response.id;
            this._toastr.success('Grade updated successfully');
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => (this.isSubmitting[student.id] = false),
        });
    } else {
      this._assignmentSubmissionSvc
        .updateSubmission(submission)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (res) => {
            this._toastr.success(res.message);
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => (this.isSubmitting[student.id] = false),
        });
    }
  }

  isStudentSubmitting(studentId: string): boolean {
    return this.isSubmitting[studentId] || false;
  }

  onLoading(event: boolean) {
    if (event === false) {
      this.loadData();
      return;
    }
    this.isLoading = event;
  }
}
