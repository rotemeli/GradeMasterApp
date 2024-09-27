import { Component } from '@angular/core';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-final-grades',
  templateUrl: './final-grades.component.html',
  styleUrl: './final-grades.component.scss',
})
export class FinalGradesComponent {
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
