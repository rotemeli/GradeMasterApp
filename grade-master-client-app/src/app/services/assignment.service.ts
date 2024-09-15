import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Assignment, IAssignmentData } from '../models/assignment.model';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  baseUrl: string = 'http://localhost:5000/api/assignment/';

  constructor(private _http: HttpClient) {}

  addNewAssignment(newAssignmentData: IAssignmentData) {
    return this._http.post(
      this.baseUrl + 'add-new-assignment',
      newAssignmentData
    );
  }

  getAssignmentsByCourseId(courseId: string) {
    return this._http.get<Assignment[]>(
      this.baseUrl + `get-course-assignments/${courseId}`
    );
  }

  updateAssignment(assignmentId: string, assignmentData: IAssignmentData) {
    return this._http.put(
      this.baseUrl + `update-assignment/${assignmentId}`,
      assignmentData
    );
  }
}
