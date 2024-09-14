import { Component } from '@angular/core';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent {
  courses: Course[] = [];
  selectedCourse: Course | undefined;
  isLoading: boolean = true;

  onCoursesLoaded(courses: Course[]) {
    this.courses = courses;
    this.isLoading = false;
  }

  onCourseSelected(course: Course | undefined) {
    this.selectedCourse = course;
  }
}
