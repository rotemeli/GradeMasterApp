import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Exam, IExamData } from '../models/exam.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  baseUrl: string = 'http://localhost:5000/api/exam/';

  constructor(private _http: HttpClient) {}

  addNewExam(newExamData: IExamData) {
    return this._http.post(this.baseUrl + 'add-new-exam', newExamData);
  }

  getExamByCourseId(courseId: string) {
    return this._http.get<Exam>(this.baseUrl + `get-course-exam/${courseId}`);
  }

  updateExam(examId: string, examData: IExamData) {
    return this._http.put(this.baseUrl + `update-exam/${examId}`, examData);
  }

  deleteExamById(examId: string, courseId: string): Observable<any> {
    return this._http.delete(
      this.baseUrl + `delete-exam/${examId}/${courseId}`
    );
  }
}
