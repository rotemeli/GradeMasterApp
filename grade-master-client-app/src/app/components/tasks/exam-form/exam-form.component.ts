import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Exam, IExamData } from '../../../models/exam.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ExamService } from '../../../services/exam.service';

@UntilDestroy()
@Component({
  selector: 'app-exam-form',
  templateUrl: './exam-form.component.html',
  styleUrl: './exam-form.component.scss',
})
export class ExamFormComponent implements OnInit {
  examForm!: FormGroup;
  formSubmitted: boolean = false;
  isLoading: boolean = false;
  isEditMode: boolean = false;

  constructor(
    private _examSvc: ExamService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ExamFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.examForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          this.noSpecialCharsValidator(),
          this.noWhitespaceValidator(),
        ],
      ],
      examDate: ['', [Validators.required]],
    });

    // For Edit Mode
    if (this.data && this.data.exam) {
      this.isEditMode = true;
      const exam: Exam = this.data.exam;
      const examData = {
        title: exam.title,
        examDate: exam.examDate,
      };
      this.examForm.patchValue(examData);
    }
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
    const examData: IExamData = {
      courseId: this.data.courseId,
      exam: {
        title: this.examForm.get('title')?.value,
        examDate: this.examForm.get('examDate')?.value,
      },
    };
    if (this.isEditMode) {
      this._examSvc
        .updateExam(this.data.exam.id, examData)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (result) => {
            this.isLoading = false;
            this.dialogRef.close(result);
          },
          error: (err) => {
            this.isLoading = false;
            console.error(err);
          },
        });
    } else {
      this._examSvc
        .addNewExam(examData)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (exam) => {
            this.isLoading = false;
            this.dialogRef.close(exam);
          },
          error: (err) => {
            this.isLoading = false;
            console.error(err);
          },
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
