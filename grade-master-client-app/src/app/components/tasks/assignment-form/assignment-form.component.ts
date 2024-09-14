import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IAssignmentData } from '../../../models/assignment.model';
import { AssignmentService } from '../../../services/assignment.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
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
    private _assignmentSvc: AssignmentService,
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

  onSubmit(): void {
    this.formSubmitted = true;
    this.isLoading = true;
    const newAssignmentData: IAssignmentData = {
      courseId: this.data.courseId,
      assignment: {
        title: this.assignmentForm.get('title')?.value,
        description: this.assignmentForm.get('description')?.value,
        dueDate: this.assignmentForm.get('dueDate')?.value,
      },
    };

    this._assignmentSvc
      .addNewAssignment(newAssignmentData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (assignment) => {
          this.isLoading = false;
          this.dialogRef.close(assignment);
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
