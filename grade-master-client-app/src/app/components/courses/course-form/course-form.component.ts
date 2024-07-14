import { Component, EventEmitter, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CourseService } from '../../../services/course.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TeacherService } from '../../../services/teacher.service';

@UntilDestroy()
@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.scss',
})
export class CourseFormComponent {
  btnWidth: string = '140px';
  btnHeight: string = '40px';

  newCourse = { title: '', teacher: { id: '' } };

  myForm: FormGroup = new FormGroup({
    courseName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      this.noSpecialCharsValidator(),
      this.noWhitespaceValidator(),
    ]),
    teacherId: new FormControl('', [
      Validators.required,
      this.numberValidator(),
    ]),
  });
  formSubmitted = false;

  constructor(
    private _courseService: CourseService,
    private _teacherService: TeacherService
  ) {}

  noSpecialCharsValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = /[!@#$%^&*(),.?":{}|<>]/.test(control.value);
      return forbidden ? { forbiddenChars: { value: control.value } } : null;
    };
  }

  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { whitespace: true };
    };
  }

  numberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const isValid = !isNaN(value) && !isNaN(parseFloat(value));
      return isValid ? null : { notNumber: { value } };
    };
  }

  onSubmit() {
    this.formSubmitted = true;
    try {
      if (this.myForm.valid) {
        const newCourse: any = {
          title: this.myForm.get('courseName')?.value,
          teacher: { id: this.myForm.get('teacherId')?.value },
        };

        this._teacherService
          .getTeachers()
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (teachers) => {
              if (
                !teachers?.some(
                  (teacher) => teacher.id === +newCourse.teacher.id
                )
              ) {
                alert('Enter an existing teacher ID');
                throw new Error('Invalid teacher ID');
              }
              this._courseService
                .getCourses()
                .pipe(untilDestroyed(this))
                .subscribe({
                  next: (courses) => {
                    if (
                      courses?.some(
                        (course) => course.title === newCourse.title
                      )
                    ) {
                      alert('This course already exists!');
                      throw new Error('Course already exists');
                    }
                    this._courseService.updateCourses([...courses, newCourse]);
                    this._courseService.addCourse(newCourse).subscribe({
                      error: (err) => {
                        throw err;
                      },
                    });
                  },
                  error: (err) => {
                    throw err;
                  },
                });
            },
          });
      }
    } catch (error) {
      throw error;
    }
  }
}
