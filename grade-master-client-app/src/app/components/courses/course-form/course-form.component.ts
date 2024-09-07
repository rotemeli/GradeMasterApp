import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { CourseService } from '../../../services/course.service';
import { AccountService } from '../../../services/account.service';
import { ICourseData } from '../../../models/course-data.model';

@UntilDestroy()
@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.scss',
})
export class CourseFormComponent implements OnInit {
  courseForm!: FormGroup;
  formSubmitted: boolean = false;
  selectedFile: File | null = null;
  students: any[] = [];
  isLoading: boolean = false;
  isEditMode: boolean = false;

  constructor(
    private _courseSvc: CourseService,
    private _accountSvc: AccountService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.courseForm = this.fb.group({
      courseName: [
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
          Validators.minLength(3),
          this.noSpecialCharsValidator(),
          this.noWhitespaceValidator(),
        ],
      ],
      numberOfLectures: ['', [Validators.required, Validators.min(1)]],
    });

    // For Edit Mode
    if (this.data && this.data.course) {
      this.isEditMode = true;
      this.courseForm.patchValue(this.data.course);
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.selectedFile = file;
      this.parseExcelFile(file);
    } else {
      this.selectedFile = null;
    }
  }

  parseExcelFile(file: File): void {
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const arrayBuffer: ArrayBuffer = e.target.result;
      const data = new Uint8Array(arrayBuffer);
      const arr = Array.from(data)
        .map((byte) => String.fromCharCode(byte))
        .join('');
      const workbook: XLSX.WorkBook = XLSX.read(arr, { type: 'binary' });

      const firstSheetName: string = workbook.SheetNames[0];
      const worksheet: XLSX.WorkSheet = workbook.Sheets[firstSheetName];

      const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      this.students = this.extractStudentData(sheetData);
    };

    reader.readAsArrayBuffer(file);
  }

  extractStudentData(data: any[]): any[] {
    const students: any[] = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const student = {
        firstName: row[0],
        lastName: row[1],
        studentId: row[2],
      };
      students.push(student);
    }
    return students;
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (
      this.courseForm.invalid ||
      (!this.isEditMode && (!this.selectedFile || !this.students.length))
    )
      return;

    this.isLoading = true;
    const courseData: ICourseData = {
      teacherId: this._accountSvc.teacherId,
      courseName: this.courseForm.get('courseName')?.value,
      description: this.courseForm.get('description')?.value,
      numberOfLectures: this.courseForm.get('numberOfLectures')?.value,
      students: this.students,
    };
    if (this.isEditMode) {
      this._courseSvc
        .updateCourse(this.data.course.id, courseData)
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
      this._courseSvc
        .createCourseAndEnrollStudents(courseData)
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
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
