import { Component, OnInit } from '@angular/core';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AccountService } from '../../services/account.service';

@UntilDestroy()
@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss',
})
export class AttendanceComponent implements OnInit {
  courses: Course[] = [];
  selectedCourse: Course | undefined;
  isLoading: boolean = true;

  constructor(
    private _accountSvc: AccountService,
    private _courseSvc: CourseService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
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
          this.courses = res.map((course) => {
            return {
              id: course.id,
              teacherId: course.teacherId,
              courseName: course.courseName,
              description: course.description,
              numberOfLectures: course.numberOfLectures,
            };
          });
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        },
      });
  }
}
