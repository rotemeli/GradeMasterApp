import { EAttendanceStatus } from '../enums/attendance-status.enum';
import { IAssignmentSubmission } from './assignment.model';

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
  id: string;
  firstName: string;
  lastName: string;
  studentId: number;
  assignmentSubmission: IAssignmentSubmission;
}

export interface IFinalGradeData {
  studentId: number;
  courseId: string;
  finalGradeValue: number;
}

export interface IStudentFinalGrade {
  studentName: string;
  finalGradeValue: number;
}
