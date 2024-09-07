import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StudentService } from '../../services/student.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IStudentData } from '../../models/student.model';

@UntilDestroy()
@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.scss',
})
export class StudentFormComponent implements OnInit {
  studentForm!: FormGroup;
  formSubmitted: boolean = false;
  isLoading: boolean = false;

  constructor(
    private _studentSvc: StudentService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StudentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          this.noSpecialCharsValidator(),
          this.noWhitespaceValidator(),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          this.noSpecialCharsValidator(),
          this.noWhitespaceValidator(),
        ],
      ],
      id: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    });
  }

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

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.studentForm.invalid) return;
    this.isLoading = true;
    const newStudentData: IStudentData = {
      courseId: this.data.courseId,
      student: {
        firstName: this.studentForm.get('firstName')?.value,
        lastName: this.studentForm.get('lastName')?.value,
        studentId: +this.studentForm.get('id')?.value,
      },
    };

    this._studentSvc
      .addNewStudent(newStudentData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (student) => {
          this.isLoading = false;
          this.dialogRef.close(student);
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err);
        },
      });
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
