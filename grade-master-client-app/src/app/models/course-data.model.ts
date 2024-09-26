export interface ICourseData {
  courseName: string;
  description: string;
  numberOfLectures: number;
  teacherId?: string;
  students: any[];
  assignmentsWeight: number;
  finalExamWeight: number;
}
