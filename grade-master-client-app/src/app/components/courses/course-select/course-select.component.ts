import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Course } from '../../../models/course.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AccountService } from '../../../services/account.service';
import { CourseService } from '../../../services/course.service';
import { FormControl } from '@angular/forms';

@UntilDestroy()
@Component({
  selector: 'app-course-select',
  templateUrl: './course-select.component.html',
  styleUrl: './course-select.component.scss',
})
export class CourseSelectComponent {
  courseControl = new FormControl();
  courses: Course[] = [];
  selectedCourse: Course | undefined;
  isLoading: boolean = true;

  @Output() courseSelected = new EventEmitter<Course | undefined>();
  @Output() coursesLoaded = new EventEmitter<Course[]>();
  @Output() loading: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private _accountSvc: AccountService,
    private _courseSvc: CourseService
  ) {}

  ngOnInit(): void {
    this.loadCourses();

    this.courseControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((course: Course | undefined) => {
        if (course) this.onCourseChange(course);
      });
  }

  loadCourses() {
    const teacherId = this._accountSvc.teacherId;

    if (!teacherId) {
      this.isLoading = false;
      this.loading.emit(false);
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
          this.loading.emit(false);
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
          this.loading.emit(false);
        },
      });
  }

  onCourseChange(course: Course) {
    this.selectedCourse = course;
    this.courseSelected.emit(this.selectedCourse);
  }

  clearSelection() {
    this.selectedCourse = undefined;
    this.courseControl.reset();
    this.courseSelected.emit(undefined);
  }
}
