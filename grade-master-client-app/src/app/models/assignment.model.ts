export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: Date;
}

export interface IAssignmentData {
  courseId: string;
  assignment: {
    title: string;
    description: string;
    dueDate: Date;
  };
}
