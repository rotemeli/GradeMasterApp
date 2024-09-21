import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../services/course.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Course } from '../../../models/course.model';
import { StudentService } from '../../../services/student.service';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { StudentFormComponent } from '../../student-form/student-form.component';

@UntilDestroy()
@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.scss',
})
export class CourseDetailsComponent implements OnInit {
  course: Course | undefined;
  students: any[] = [];
  paginatedStudents: any[] = [];
  isLoading = true;

  pageSize = 10;
  pageIndex = 0;
  length = 0;

  constructor(
    private _route: ActivatedRoute,
    private _courseSvc: CourseService,
    private _studentSvc: StudentService,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCourse();
  }

  loadCourse() {
    const courseId = this._route.snapshot.paramMap.get('id');
    if (!courseId) return;
    this._courseSvc
      .getCourseById(courseId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (course) => {
          this.loadStudents(courseId);
          this.course = course;
        },
        error: (err) => console.error('Error fetching course:', err),
      });
  }

  loadStudents(courseId: string) {
    this._studentSvc
      .getStudentsByCourseId(courseId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (students) => {
          this.students = this.sortedStudents(students);
          this.length = this.students.length;
          this.paginate({
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            length: this.length,
          });
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching course:', err);
          this.isLoading = false;
        },
      });
  }

  sortedStudents(students: any[]) {
    return students.sort((a, b) => {
      const nameA = a.lastName.toLowerCase();
      const nameB = b.lastName.toLowerCase();

      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  }

  paginate(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.paginatedStudents = this.students.slice(startIndex, endIndex);
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  removeStudent(studentId: string): void {
    if (!this.course) return;
    this._studentSvc
      .deleteStudentFromCourse(this.course.id, studentId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (_) => {
          this.students = this.students.filter(
            (student) => student.id !== studentId
          );
          this.length = this.students.length;
          this.paginate({
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            length: this.length,
          });
        },
        error: (err) => console.log(err),
      });
  }

  openStudentForm() {
    const dialogRef = this._dialog.open(StudentFormComponent, {
      width: '600px',
      height: 'auto',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: {
        courseId: this.course?.id,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((result) => {
        if (result) {
          this.students.push(result);
          this.length = this.students.length;
          this.paginate({
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            length: this.length,
          });
        }
      });
  }
}
