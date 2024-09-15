import { Component, OnInit } from '@angular/core';
import { Course } from '../../models/course.model';
import { MatDialog } from '@angular/material/dialog';
import { AssignmentFormComponent } from './assignment-form/assignment-form.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AccountService } from '../../services/account.service';
import { AssignmentService } from '../../services/assignment.service';
import { Assignment } from '../../models/assignment.model';

@UntilDestroy()
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent implements OnInit {
  courses: Course[] = [];
  assignments: Assignment[] = [];
  selectedCourse: Course | undefined;
  isLoading: boolean = true;

  constructor(
    private _assignmentSvc: AssignmentService,
    private _accountSvc: AccountService,
    private _dialog: MatDialog
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
    } else {
      this.assignments = [];
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
    if (!this._accountSvc.teacherId || !this.selectedCourse?.id) return;
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

  openExamForm() {}
}
