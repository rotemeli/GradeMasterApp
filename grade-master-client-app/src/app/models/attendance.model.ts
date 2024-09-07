import { EAttendanceStatus } from '../enums/attendance-status.enum';

export interface IAttendanceData {
  courseId: string | undefined;
  lectureName: string;
  status: EAttendanceStatus;
  studentId: number;
}

export interface StudentAttendance {
  courseId: string;
  attendanceDetails: Attendance[];
}

export interface Attendance {
  lectureName: string;
  status: EAttendanceStatus;
}
