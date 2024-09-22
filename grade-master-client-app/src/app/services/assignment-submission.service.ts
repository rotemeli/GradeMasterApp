import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAssignmentSubmission } from '../models/assignment.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AssignmentSubmissionService {
  baseUrl: string = 'http://localhost:5000/api/assignmentsubmission/';
  constructor(private _http: HttpClient) {}

  addNewAssignmentSubmission(
    studentId: string,
    submission: IAssignmentSubmission
  ): Observable<any> {
    return this._http.post(
      this.baseUrl + `add-submission/${studentId}`,
      submission
    );
  }

  updateSubmission(submission: IAssignmentSubmission): Observable<any> {
    return this._http.put(this.baseUrl + 'update-submission', submission);
  }
}
