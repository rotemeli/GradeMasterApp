import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAssignmentData } from '../models/assignment.model';

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
}
