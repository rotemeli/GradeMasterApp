export interface Assignment {
  id: string;
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
