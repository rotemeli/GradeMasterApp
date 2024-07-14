import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course } from '../models/course.model';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  apiUrl: string = 'http://localhost:8080/api/courses';
  private _courses$: BehaviorSubject<Course[]> = new BehaviorSubject<Course[]>(
    []
  );
  courses$ = this._courses$.asObservable();

  constructor(private _http: HttpClient) {}

  getCourses() {
    return this._http.get<Course[]>(this.apiUrl);
  }

  addCourse(course: Course) {
    return this._http.post<Course>(this.apiUrl, course);
  }

  updateCourses(courses: Course[]): void {
    this._courses$.next(courses);
  }
}
