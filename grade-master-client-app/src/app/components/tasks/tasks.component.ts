import { Component } from '@angular/core';
import { Course } from '../../models/course.model';
import { MatDialog } from '@angular/material/dialog';
import { AssignmentFormComponent } from './assignment-form/assignment-form.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent {
  courses: Course[] = [];
  selectedCourse: Course | undefined;
  isLoading: boolean = true;

  constructor(private _dialog: MatDialog) {}

  onCoursesLoaded(courses: Course[]) {
    this.courses = courses;
    this.isLoading = false;
  }

  onCourseSelected(course: Course | undefined) {
    this.selectedCourse = course;
  }

  openAssignmentForm() {
    const dialogRef = this._dialog.open(AssignmentFormComponent, {
      width: '600px',
      height: 'auto',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: {
        courseId: this.selectedCourse?.id,
      },
    });
  }

  openExamForm() {}
}
