export interface Exam {
  id: string;
  title: string;
  examDate: Date;
}

export interface IExamData {
  courseId: string;
  exam: {
    title: string;
    examDate: Date;
  };
}
