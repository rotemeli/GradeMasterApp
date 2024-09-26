import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../services/course.service';
import { Course } from '../../../models/course.model';
import { AccountService } from '../../../services/account.service';
import { MatDialog } from '@angular/material/dialog';
import { CourseFormComponent } from '../course-form/course-form.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@UntilDestroy()
@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  selectedCourse: string = '';
  isDeleting: { [key: string]: boolean } = {};

  constructor(
    private _courseSvc: CourseService,
    private _accountSvc: AccountService,
    private _dialog: MatDialog,
    private _router: Router,
    private _toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchCourses();
  }

  fetchCourses() {
    if (!this._accountSvc.teacherId) return;
    this._courseSvc
      .getCoursesByTeacherId(this._accountSvc.teacherId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res) => {
          this.courses = res.map((course: any) => {
            return {
              id: course.id,
              teacherId: course.teacherId,
              courseName: course.courseName,
              description: course.description,
              numberOfLectures: course.numberOfLectures,
              assignmentWeight: course.assignmentWeight,
              finalExamWeight: course.finalExamWeight,
            };
          });
        },
        error: (err) => {
          throw err;
        },
      });
  }

  get teacherName(): string {
    return this._accountSvc.teacherName;
  }

  openCourseForm(course: Course | null = null) {
    const dialogRef = this._dialog.open(CourseFormComponent, {
      width: '600px',
      height: 'auto',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: {
        course: course,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((result) => {
        if (result) {
          this.fetchCourses();
        }
      });
  }

  deleteCourse(courseId: string) {
    this.isDeleting[courseId] = true;
    this._courseSvc
      .deleteCourseById(courseId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res) => {
          this.courses = this.courses.filter(
            (course) => course.id !== courseId
          );
          this.isDeleting[courseId] = false;
          this._toastr.success(res.message);
        },
        error: (err) => {
          this.isDeleting[courseId] = false;
          console.error('Failed to delete course:', err);
        },
      });
  }

  viewCourseDetails(courseId: string): void {
    this._router.navigate(['/courses', courseId, 'details']);
  }
}
