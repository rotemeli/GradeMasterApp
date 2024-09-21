import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IStudentData } from '../models/student.model';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  baseUrl: string = 'http://localhost:5000/api/students/';

  constructor(private _http: HttpClient) {}

  getStudentsByCourseId(courseId: string) {
    return this._http.get<any[]>(
      this.baseUrl + `get-students-by-course/${courseId}`
    );
  }

  addNewStudent(newStudentData: IStudentData) {
    return this._http.post(this.baseUrl + 'add-new-student', newStudentData);
  }

  deleteStudentFromCourse(courseId: string, studentId: string) {
    return this._http.delete(
      this.baseUrl + `remove-student-from-course/${courseId}/${studentId}`
    );
  }
}
