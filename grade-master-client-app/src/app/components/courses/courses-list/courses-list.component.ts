import { Component, Input, OnInit } from '@angular/core';
import { Course } from '../../../models/course.model';
import { CourseService } from '../../../services/course.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrl: './courses-list.component.scss',
})
export class CoursesListComponent implements OnInit {
  constructor(public courseService: CourseService) {}

  ngOnInit(): void {
    this.getCourses();
  }

  getCourses() {
    this.courseService
      .getCourses()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (courses) => this.courseService.updateCourses(courses),
        error: (error) => {
          throw error;
        },
      });
  }
}
