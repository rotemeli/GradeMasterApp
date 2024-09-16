import { EAttendanceStatus } from '../enums/attendance-status.enum';

export interface Student {
  id: string;
  name: string;
  attendance: {
    [key: string]: EAttendanceStatus;
  };
}

export interface IStudentData {
  courseId: string;
  student: {
    firstName: string;
    lastName: string;
    studentId: number;
  };
}

export interface ITaskStudentData {
  firstName: string;
  lastName: string;
  studentId: number;
  assignmentsSubmission: any;
}
