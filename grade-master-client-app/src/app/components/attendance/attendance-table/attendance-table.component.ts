import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { StudentService } from '../../../services/student.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Student } from '../../../models/student.model';
import { Course } from '../../../models/course.model';
import { AttendanceService } from '../../../services/attendance.service';
import { EAttendanceStatus } from '../../../enums/attendance-status.enum';
import {
  Attendance,
  IAttendanceData,
  StudentAttendance,
} from '../../../models/attendance.model';
import { ToastrService } from 'ngx-toastr';

@UntilDestroy()
@Component({
  selector: 'app-attendance-table',
  templateUrl: './attendance-table.component.html',
  styleUrl: './attendance-table.component.scss',
})
export class AttendanceTableComponent implements OnChanges {
  @Input() course: Course | undefined;

  dataSource: Student[] = [];
  lectures: string[] = [];
  displayedColumns: string[] = [];
  attendanceOptions = [
    { value: 0, viewValue: 'Present' },
    { value: 1, viewValue: 'Absent' },
    { value: 2, viewValue: 'Late' },
  ];

  isLoading!: boolean;
  isExporting: boolean = false;

  constructor(
    private _studentSvc: StudentService,
    private _attendanceSvc: AttendanceService,
    private _toastr: ToastrService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['course'] && this.course) {
      this.isLoading = true;
      this.initializeAttendanceTable(+this.course.numberOfLectures);
      this.loadData();
    }
  }

  initializeAttendanceTable(numberOfLectures: number): void {
    this.lectures = [];
    this.displayedColumns = ['id', 'name'];
    for (let i = 1; i <= numberOfLectures; i++) {
      this.lectures.push(`Lecture${i}`);
    }

    this.displayedColumns.push(...this.lectures);
  }

  loadData(): void {
    if (!this.course) return;

    this.isLoading = true;

    this._studentSvc
      .getStudentsByCourseId(this.course.id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res) => {
          this.dataSource = res.map((student: any) => {
            const attendance: { [key: string]: EAttendanceStatus } = {};

            if (!student.attendances || student.attendances.length === 0) {
              this.lectures.forEach((lecture) => {
                attendance[lecture] = EAttendanceStatus.NotSet;
              });
            } else {
              student.attendances.forEach(
                (studentAttendance: StudentAttendance) => {
                  if (studentAttendance.courseId === this.course?.id) {
                    studentAttendance.attendanceDetails.forEach(
                      (att: Attendance) => {
                        attendance[att.lectureName] = att.status;
                      }
                    );
                  }
                }
              );

              this.lectures.forEach((lecture) => {
                if (!attendance.hasOwnProperty(lecture)) {
                  attendance[lecture] = EAttendanceStatus.NotSet;
                }
              });
            }

            return {
              id: student.studentId,
              name: `${student.firstName} ${student.lastName}`,
              attendance,
            };
          });
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err);
        },
      });
  }

  onSubmit() {
    if (!this.course) return;

    const attendanceData: IAttendanceData[][] = this.dataSource.map(
      (student) => {
        return Object.keys(student.attendance).map((lecture) => {
          const lectureAttendance: EAttendanceStatus =
            student.attendance[lecture];

          let status: EAttendanceStatus;
          switch (lectureAttendance) {
            case EAttendanceStatus.Present:
              status = EAttendanceStatus.Present;
              break;
            case EAttendanceStatus.Absent:
              status = EAttendanceStatus.Absent;
              break;
            case EAttendanceStatus.Late:
              status = EAttendanceStatus.Late;
              break;
            default:
              status = EAttendanceStatus.NotSet;
              break;
          }

          return {
            studentId: Number(student.id),
            courseId: this.course?.id,
            lectureName: lecture,
            status: status,
          };
        });
      }
    );

    this.isLoading = true;
    this._attendanceSvc
      .updateAttendance(attendanceData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (!this.isExporting) this._toastr.success(res.message);
          this.isExporting = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.isExporting = false;
          console.log(err);
        },
      });
  }

  exportToCSV(): void {
    if (!this.dataSource.length || !this.course) {
      return;
    }
    this.isExporting = true;
    this.onSubmit();

    const csvRows: string[] = [];

    const headers = ['Id', 'Name', ...this.lectures];
    csvRows.push(headers.join(','));

    // Add student data for each row
    this.dataSource.forEach((student: any) => {
      const row = [
        student.id,
        student.name,
        ...this.lectures.map((lecture) =>
          this.getAttendanceDisplayValue(student.attendance[lecture])
        ),
      ];
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${this.course?.courseName}_attendance.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  getAttendanceDisplayValue(status: EAttendanceStatus): string {
    switch (status) {
      case EAttendanceStatus.Present:
        return 'Present';
      case EAttendanceStatus.Absent:
        return 'Absent';
      case EAttendanceStatus.Late:
        return 'Late';
      default:
        return 'Not Set';
    }
  }
}
