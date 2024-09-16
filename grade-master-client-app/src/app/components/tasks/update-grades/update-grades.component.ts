import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from '../../../services/student.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ITaskStudentData } from '../../../models/student.model';

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
  isLoading!: boolean;

  constructor(
    private _studentSvc: StudentService,
    private _route: ActivatedRoute
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
            const studentAssignment = student.assignmentsSubmissions.filter(
              (submission: any) => submission.assignmentId === this.taskId
            );
            return {
              firstName: student.firstName,
              lastName: student.lastName,
              studentId: student.studentId,
              assignmentsSubmission: studentAssignment,
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

  onSubmit(): void {}
}
