import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Course } from '../../../models/course.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AccountService } from '../../../services/account.service';
import { CourseService } from '../../../services/course.service';

@UntilDestroy()
@Component({
  selector: 'app-course-select',
  templateUrl: './course-select.component.html',
  styleUrl: './course-select.component.scss',
})
export class CourseSelectComponent {
  courses: Course[] = [];
  selectedCourse: Course | undefined;
  isLoading: boolean = true;

  @Output() courseSelected = new EventEmitter<Course | undefined>();
  @Output() coursesLoaded = new EventEmitter<Course[]>();

  constructor(
    private _accountSvc: AccountService,
    private _courseSvc: CourseService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses() {
    const teacherId = this._accountSvc.teacherId;

    if (!teacherId) {
      this.isLoading = false;
      return;
    }

    this._courseSvc
      .getCoursesByTeacherId(teacherId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res) => {
          this.courses = res;
          this.coursesLoaded.emit(this.courses);
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        },
      });
  }

  onCourseChange(course: Course) {
    this.selectedCourse = course;
    this.courseSelected.emit(this.selectedCourse);
  }
}
