import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course } from '../models/course.model';
import { map, Observable } from 'rxjs';
import { ICourseData } from '../models/course-data.model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  baseUrl: string = 'http://localhost:5000/api/course/';

  constructor(private _http: HttpClient) {}

  createCourseAndEnrollStudents(courseData: ICourseData): Observable<any> {
    return this._http.post(this.baseUrl + 'create-course', courseData);
  }

  getCoursesByTeacherId(teacherId: string) {
    return this._http.get<any[]>(
      this.baseUrl + `get-courses-by-teacher/${teacherId}`
    );
  }

  getCourseById(courseId: any): Observable<Course> {
    return this._http.get<any>(this.baseUrl + `get-course/${courseId}`).pipe(
      map((course) => {
        return {
          id: course.id,
          teacherId: course.teacherId,
          courseName: course.courseName,
          description: course.description,
          numberOfLectures: course.numberOfLectures,
        };
      })
    );
  }

  updateCourse(courseId: string, courseData: ICourseData) {
    return this._http.put(
      this.baseUrl + `update-course/${courseId}`,
      courseData
    );
  }

  deleteCourseById(courseId: string) {
    return this._http.delete(this.baseUrl + `delete-course/${courseId}`);
  }
}
