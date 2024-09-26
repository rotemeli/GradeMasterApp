import { Component, OnInit } from '@angular/core';
import { Course } from '../../models/course.model';
import { MatDialog } from '@angular/material/dialog';
import { AssignmentFormComponent } from './assignment-form/assignment-form.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AssignmentService } from '../../services/assignment.service';
import { Assignment } from '../../models/assignment.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ExamFormComponent } from './exam-form/exam-form.component';
import { Exam } from '../../models/exam.model';
import { ExamService } from '../../services/exam.service';

@UntilDestroy()
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent implements OnInit {
  courses: Course[] = [];
  assignments: Assignment[] = [];
  exam: Exam | null = null;
  selectedCourse: Course | undefined;
  isLoading: boolean = true;
  isDeleting: { [key: string]: boolean } = {};

  constructor(
    private _assignmentSvc: AssignmentService,
    private _examSvc: ExamService,
    private _dialog: MatDialog,
    private _router: Router,
    private _toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  onCoursesLoaded(courses: Course[]) {
    this.courses = courses;
    this.isLoading = false;
  }

  onCourseSelected(course: Course | undefined) {
    this.selectedCourse = course;
    if (this.selectedCourse) {
      this.fetchAssignments();
      this.fetchExam();
    } else {
      this.assignments = [];
      this.exam = null;
    }
  }

  openAssignmentForm(assignment: Assignment | null = null) {
    const dialogRef = this._dialog.open(AssignmentFormComponent, {
      width: '600px',
      height: 'auto',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: {
        courseId: this.selectedCourse?.id,
        assignment: assignment,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((result) => {
        if (result) {
          this.fetchAssignments();
        }
      });
  }

  fetchAssignments() {
    if (!this.selectedCourse?.id) return;
    this.assignments = [];
    this._assignmentSvc
      .getAssignmentsByCourseId(this.selectedCourse.id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (assignments) => {
          this.assignments = assignments;
        },
        error: (err) => console.log(err),
      });
  }

  fetchExam() {
    if (!this.selectedCourse?.id) return;
    this.exam = null;
    this._examSvc
      .getExamByCourseId(this.selectedCourse.id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (exam) => {
          this.exam = exam;
        },
        error: (err) => console.log(err),
      });
  }

  onDeleteAssignment(assignmentId: string) {
    if (!this.selectedCourse?.id) return;
    this.isDeleting[assignmentId] = true;
    this._assignmentSvc
      .deleteAssignmentById(assignmentId, this.selectedCourse.id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res) => {
          this.assignments = this.assignments.filter(
            (assignment) => assignment.id !== assignmentId
          );
          this.isDeleting[assignmentId] = false;
          this._toastr.success(res.message);
        },
        error: (err) => {
          this.isDeleting[assignmentId] = false;
          console.error('Failed to delete assignment:', err);
        },
      });
  }

  onUpdateAssignment(taskId: string) {
    this._router.navigate(
      ['/tasks', taskId, this.selectedCourse?.id, 'grades'],
      {
        queryParams: { taskType: 'assignment' },
      }
    );
  }

  openExamForm(exam: Exam | null = null) {
    const dialogRef = this._dialog.open(ExamFormComponent, {
      width: '600px',
      height: 'auto',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: {
        courseId: this.selectedCourse?.id,
        exam: exam,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((result) => {
        if (result) {
          this.fetchExam();
        }
      });
  }

  onDeleteExam(examId: string) {
    if (!this.selectedCourse?.id) return;
    this.isDeleting[examId] = true;
    this._examSvc
      .deleteExamById(examId, this.selectedCourse.id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res) => {
          this.exam = null;
          this.isDeleting[examId] = false;
          this._toastr.success(res.message);
        },
        error: (err) => {
          this.isDeleting[examId] = false;
          console.error('Failed to delete exam:', err);
        },
      });
  }

  onUpdateExam(taskId: string) {
    this._router.navigate(
      ['/tasks', taskId, this.selectedCourse?.id, 'grades'],
      {
        queryParams: { taskType: 'exam' },
      }
    );
  }
}
