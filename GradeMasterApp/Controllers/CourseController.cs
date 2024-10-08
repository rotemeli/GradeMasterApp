﻿using GradeMasterApp.DTOs;
using GradeMasterApp.Models;
using GradeMasterApp.Repositories;
using GradeMasterApp.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GradeMasterApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly CourseRepository _courseRepository;
        private readonly EnrollmentRepository _enrollmentRepository;
        private readonly StudentRepository _studentRepository;
        private readonly AssignmentRepository _assignmentRepository;
        private readonly ExamRepository _examRepository;

        public CourseController(
            CourseRepository courseRepository,
            EnrollmentRepository enrollmentRepository,
            StudentRepository studentRepository,
            AssignmentRepository assignmentRepository,
            ExamRepository examRepository)
        {
            _courseRepository = courseRepository;
            _enrollmentRepository = enrollmentRepository;
            _studentRepository = studentRepository;
            _assignmentRepository = assignmentRepository;
            _examRepository = examRepository;
        }

        // Create a new course and enroll students
        [HttpPost("create-course")]
        public async Task<IActionResult> CreateCourseAndEnrollStudents([FromBody] CourseDTO courseDto)
        {
            if (courseDto == null || string.IsNullOrEmpty(courseDto.CourseName))
            {
                return BadRequest("Invalid course data.");
            }

            // Create the new course
            var course = new Course
            {
                TeacherId = courseDto.TeacherId,
                CourseName = courseDto.CourseName,
                Description = courseDto.Description,
                NumberOfLectures = courseDto.NumberOfLectures,
                AssignmentWeight = courseDto.AssignmentsWeight,
                FinalExamWeight = courseDto.FinalExamWeight
            };

            await _courseRepository.AddCourseAsync(course);

            var tasks = new List<Task>();

            // Enroll each student
            foreach (var studentDto in courseDto.Students)
            {
                tasks.Add(EnrollStudentAsync(studentDto, course));
            }

            await Task.WhenAll(tasks);

            await _courseRepository.UpdateCourseAsync(course);

            return Ok(new { Message = "Course created successfully" });
        }

        // Helper method to enroll a student in a course
        private async Task EnrollStudentAsync(StudentDTO studentDto, Course course)
        {
            // Find the student by StudentId or create a new one if not found
            var student = await _studentRepository.GetStudentByStudentIdAsync(studentDto.StudentId)
                          ?? new Student
                          {
                              FirstName = studentDto.FirstName,
                              LastName = studentDto.LastName,
                              StudentId = studentDto.StudentId
                          };

            if (student.Id == null)
            {
                await _studentRepository.AddStudentAsync(student);
            }

            // Create the enrollment
            var enrollment = new Enrollment
            {
                CourseId = course.Id,
                StudentId = student.Id,
                EnrollmentDate = DateTime.UtcNow
            };

            await _enrollmentRepository.AddEnrollmentAsync(enrollment);

            // Update student's enrollments
            student.Enrollments.Add(enrollment.Id);
            await _studentRepository.UpdateStudentAsync(student);

            course.Enrollments.Add(enrollment.Id);
        }


        // Get a specific course by ID
        [HttpGet("get-course/{id}")]
        public async Task<IActionResult> GetCourseById(string id)
        {
            var course = await _courseRepository.GetCourseByIdAsync(id);
            if (course == null)
            {
                return NotFound("Course not found.");
            }

            return Ok(course);
        }

        // Update a course by id
        [HttpPut("update-course/{id}")]
        public async Task<IActionResult> UpdateCourse([FromRoute] string id, [FromBody] CourseDTO courseDto)
        {
            if (courseDto == null || string.IsNullOrEmpty(id))
            {
                return BadRequest("Invalid course data.");
            }

            // Find the course by ID
            var course = await _courseRepository.GetCourseByIdAsync(id);
            if (course == null)
            {
                return NotFound("Course not found.");
            }

            if (courseDto.NumberOfLectures < course.NumberOfLectures)
            {
                var enrollments = await _enrollmentRepository.GetEnrollmentsByCourseIdAsync(id);
                var studentIds = enrollments.Select(e => e.StudentId).ToList();

                List<Student>? students = null;
                if (studentIds.Any())
                {
                    students = await _studentRepository.GetStudentsByIdsAsync(studentIds);
                }

                int diff = course.NumberOfLectures - courseDto.NumberOfLectures;

                var validLectureNames = Enumerable.Range(1, courseDto.NumberOfLectures)
                                  .Select(i => $"Lecture{i}")
                                  .ToList();
                if (students != null)
                {
                    foreach (var student in students)
                    {
                        var studentAttendance = student.Attendances.FirstOrDefault(a => a.CourseId == id);
                        if (studentAttendance != null)
                        {
                            var redundantAttendances = studentAttendance.AttendanceDetails
                                .Where(a => !validLectureNames.Contains(a.LectureName))
                                .ToList();

                            foreach (var attendance in redundantAttendances)
                            {
                                studentAttendance.AttendanceDetails.Remove(attendance);
                            }

                            await _studentRepository.UpdateStudentAsync(student);
                        }
                    }
                }
            }

            // Update the course fields with the new data
            course.CourseName = courseDto.CourseName;
            course.Description = courseDto.Description;
            course.NumberOfLectures = courseDto.NumberOfLectures;
            course.AssignmentWeight = courseDto.AssignmentsWeight;
            course.FinalExamWeight = courseDto.FinalExamWeight;

            await _courseRepository.UpdateCourseAsync(course);

            return Ok(course);
        }

        // Delete a course by id
        [HttpDelete("delete-course/{id}")]
        public async Task<IActionResult> DeleteCourse(string id)
        {
            var course = await _courseRepository.GetCourseByIdAsync(id).ConfigureAwait(false);
            if (course == null)
            {
                return NotFound("Course not found.");
            }

            var tasks = new List<Task>();

            foreach (var enrollmentId in course.Enrollments)
            {
                tasks.Add(DeleteEnrollmentAndUpdateStudentAsync(enrollmentId, course.Assignments, id));
            }

            foreach (var assignmentId in course.Assignments)
            {
                tasks.Add(_assignmentRepository.DeleteAssignmentAsync(assignmentId));
            }

            tasks.Add(DeleteExamsByCourseIdAsync(id));

            await Task.WhenAll(tasks).ConfigureAwait(false);

            await _courseRepository.DeleteCourseAsync(id).ConfigureAwait(false);

            return Ok(new { Message = "Course deleted successfully" });
        }

        // Deletes exams that have the given courseId
        private async Task DeleteExamsByCourseIdAsync(string courseId)
        {
            var exams = await _examRepository.GetExamsByCourseIdAsync(courseId).ConfigureAwait(false);
            foreach (var exam in exams)
            {
                await _examRepository.DeleteExamAsync(exam.Id).ConfigureAwait(false);
            }
        }

        // Helper method to delete an enrollment and update the student's records
        private async Task DeleteEnrollmentAndUpdateStudentAsync(string enrollmentId, List<string> assignmentIds, string courseId)
        {
            var enrollment = await _enrollmentRepository.GetEnrollmentByIdAsync(enrollmentId).ConfigureAwait(false);
            if (enrollment != null)
            {
                var student = await _studentRepository.GetStudentByIdAsync(enrollment.StudentId).ConfigureAwait(false);
                if (student != null)
                {
                    student.Enrollments.Remove(enrollmentId);
                    student.Attendances.RemoveAll(a => a.CourseId == courseId);

                    student.AssignmentsSubmissions.RemoveAll(sub => assignmentIds.Contains(sub.AssignmentId));

                    student.FinalGrades.RemoveAll(fg => fg.CourseId == courseId);

                    await _studentRepository.UpdateStudentAsync(student).ConfigureAwait(false);
                }
                await _enrollmentRepository.DeleteEnrollmentAsync(enrollmentId).ConfigureAwait(false);
            }
        }

        // Get all courses for a specific teacher
        [HttpGet("get-courses-by-teacher/{teacherId}")]
        public async Task<IActionResult> GetCoursesByTeacher(string teacherId)
        {
            var courses = await _courseRepository.GetCoursesByTeacherIdAsync(teacherId);
            if (courses == null || !courses.Any())
            {
                return NotFound("No courses found for this teacher.");
            }

            return Ok(courses);
        }
    }
}
