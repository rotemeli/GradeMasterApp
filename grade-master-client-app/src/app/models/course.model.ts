import { Exam } from './exam.model';

export interface Course {
  id: string;
  teacherId: string;
  courseName: string;
  description: string;
  numberOfLectures: string;
  assignmentWeight: number;
  finalExamWeight: number;
  finalExam?: Exam;
}

export interface Mock {
  id: string;
  title: string;
  description: string;
}
