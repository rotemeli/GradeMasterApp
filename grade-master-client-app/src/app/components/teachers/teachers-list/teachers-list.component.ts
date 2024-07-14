import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../../../services/teacher.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Teacher } from '../../../models/teacher.model';

@UntilDestroy()
@Component({
  selector: 'app-teachers-list',
  templateUrl: './teachers-list.component.html',
  styleUrl: './teachers-list.component.scss',
})
export class TeachersListComponent implements OnInit {
  teachers: Teacher[] | undefined;

  constructor(private _teacherService: TeacherService) {}

  ngOnInit(): void {
    this.getCourses();
  }

  getCourses() {
    this._teacherService
      .getTeachers()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (teachers) => (this.teachers = teachers),
        error: (error) => {
          throw error;
        },
      });
  }
}
