import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as XLSX from 'xlsx';
import { GradesService } from '../../../../services/grades.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';

@UntilDestroy()
@Component({
  selector: 'app-upload-grades',
  templateUrl: './upload-grades.component.html',
  styleUrl: './upload-grades.component.scss',
})
export class UploadGradesComponent {
  @Input() taskId: string | null = null;
  @Output() isLoading: EventEmitter<boolean> = new EventEmitter<boolean>();
  grades: Grade[] = [];

  constructor(
    private _gradesSvc: GradesService,
    private _toastr: ToastrService
  ) {}

  onFileChange(event: any) {
    if (!this.taskId) return;
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) {
      console.error('Cannot use multiple files');
      return;
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      // Take the first sheet
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      // Save data
      const sheetData = XLSX.utils.sheet_to_json(ws, { header: 1 });
      this.grades = this.extractGradesData(sheetData);

      // Call updateGrades only after the grades are processed
      this.updateGrades();

      // Reset the file input value so it can trigger again with the same file
      (event.target as HTMLInputElement).value = '';
    };
    reader.readAsArrayBuffer(target.files[0]);
  }

  extractGradesData(data: any[]): any[] {
    const grades: Grade[] = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const grade = {
        studentId: row[0],
        grade: row[1],
      };
      grades.push(grade);
    }
    return grades;
  }

  updateGrades() {
    const gradesData: GradesReport = {
      taskId: this.taskId,
      grades: this.grades,
    };
    this.isLoading.emit(true);
    this._gradesSvc
      .updateGrades(gradesData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res) => {
          this._toastr.success(res.message);
          this.isLoading.emit(false);
        },
        error: (err) => {
          console.log(err);
          this.isLoading.emit(false);
        },
      });
  }
}

export interface GradesReport {
  taskId: string | null;
  grades: Grade[];
}

export interface Grade {
  studentId: string;
  grade: number;
}
