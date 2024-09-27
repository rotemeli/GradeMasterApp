import { Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Course } from '../../models/course.model';
import { ToastrService } from 'ngx-toastr';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { GradesService } from '../../services/grades.service';
import { IStudentFinalGrade } from '../../models/student.model';

@UntilDestroy()
@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
})
export class StatisticsComponent {
  courses: Course[] = [];
  selectedCourse: Course | undefined;
  finalGradesData: any[] = [];
  isLoading: boolean = true;
  averageGrade: number | null = null;

  // Chart colors
  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#E8A838', '#FF5F57', '#7DB3FF', '#4C566A'],
  };

  constructor(private _gradesSvc: GradesService) {}

  onCoursesLoaded(courses: Course[]): void {
    this.courses = courses;
  }

  onCourseSelected(course: Course | undefined): void {
    this.selectedCourse = course;
    if (this.selectedCourse) {
      this.isLoading = true;
      this.loadCourseFinalGrades(this.selectedCourse.id);
    } else {
      this.finalGradesData = [];
    }
  }

  onLoading(event: boolean) {
    this.isLoading = event;
  }

  loadCourseFinalGrades(courseId: string): void {
    this.isLoading = true;
    this._gradesSvc
      .getFinalGradesByCourseId(courseId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (grades: IStudentFinalGrade[]) => {
          if (grades.length === 0) {
            this.finalGradesData = [];
          } else {
            this.finalGradesData = grades.map((grade: IStudentFinalGrade) => ({
              name: grade.studentName,
              value: grade.finalGradeValue,
            }));
            this.calculateCourseAverage(grades);
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err);
        },
      });
  }

  // Formatting long student names
  formatStudentName(studentName: string): string {
    return studentName.length > 8
      ? studentName.substring(0, 8) + '...'
      : studentName;
  }

  calculateCourseAverage(grades: IStudentFinalGrade[]): void {
    const total = grades.reduce((acc, grade) => acc + grade.finalGradeValue, 0);
    this.averageGrade = grades.length ? total / grades.length : null;
  }
}
