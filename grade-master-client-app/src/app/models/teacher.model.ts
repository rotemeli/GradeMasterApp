import { Course } from "./course.model";

export interface Teacher {
    id: number;
    name: string;
    email: string;
    password: string;
    courses: Course[];
}
