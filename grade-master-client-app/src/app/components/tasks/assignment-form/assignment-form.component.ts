import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { StudentService } from '../../../services/student.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-assignment-form',
  templateUrl: './assignment-form.component.html',
  styleUrl: './assignment-form.component.scss',
})
export class AssignmentFormComponent implements OnInit {
  assignmentForm!: FormGroup;
  formSubmitted: boolean = false;
  isLoading: boolean = false;

  constructor(
    private _studentSvc: StudentService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AssignmentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.assignmentForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          this.noSpecialCharsValidator(),
          this.noWhitespaceValidator(),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          this.noSpecialCharsValidator(),
          this.noWhitespaceValidator(),
        ],
      ],
      dueDate: ['', [Validators.required]],
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

  onSubmit(): void {}

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
