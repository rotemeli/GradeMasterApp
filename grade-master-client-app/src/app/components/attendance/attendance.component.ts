import { Component } from '@angular/core';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss',
})
export class AttendanceComponent {
  courses: Course[] = [];
  selectedCourse: Course | undefined;
  isLoading: boolean = true;

  onCoursesLoaded(courses: Course[]) {
    this.courses = courses;
  }

  onCourseSelected(course: Course | undefined) {
    this.selectedCourse = course;
  }

  onLoading(event: boolean) {
    this.isLoading = event;
  }
}
