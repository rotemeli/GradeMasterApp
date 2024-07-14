import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private _courseService: CourseService) {}

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  onLogin(): void {
    this._courseService.getCourses().pipe(untilDestroyed(this)).subscribe({
      next: res => console.log(res),
      error: error => console.log(error)
    });

    // this._courseService.postCourse().pipe(untilDestroyed(this)).subscribe({
    //   next: res => console.log(res),
    //   error: error => console.log(error)
    // });
  }
}
