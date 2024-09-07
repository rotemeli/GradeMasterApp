using GradeMasterApp.DTOs;
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

        public CourseController(
            CourseRepository courseRepository,
            EnrollmentRepository enrollmentRepository,
            StudentRepository studentRepository)
        {
            _courseRepository = courseRepository;
            _enrollmentRepository = enrollmentRepository;
            _studentRepository = studentRepository;
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
                NumberOfLectures = courseDto.NumberOfLectures
            };

            await _courseRepository.AddCourseAsync(course);

            // Enroll each student
            foreach (var studentDto in courseDto.Students)
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

            await _courseRepository.UpdateCourseAsync(course);

            return Ok(new { Message = "Course and enrollments created successfully" });
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

            // Update the course fields with the new data
            course.CourseName = courseDto.CourseName;
            course.Description = courseDto.Description;
            course.NumberOfLectures = courseDto.NumberOfLectures;

            await _courseRepository.UpdateCourseAsync(course);

            return Ok(course);
        }

        // Delete a course by id
        [HttpDelete("delete-course/{id}")]
        public async Task<IActionResult> DeleteCourse(string id)
        {
            var course = await _courseRepository.GetCourseByIdAsync(id);
            if (course == null)
            {
                return NotFound("Course not found.");
            }

            foreach (var enrollmentId in course.Enrollments)
            {
                await _enrollmentRepository.DeleteEnrollmentAsync(enrollmentId);

                var enrollment = await _enrollmentRepository.GetEnrollmentByIdAsync(enrollmentId);
                if (enrollment != null)
                {
                    var student = await _studentRepository.GetStudentByIdAsync(enrollment.StudentId);
                    if (student != null)
                    {
                        student.Enrollments.Remove(enrollmentId);
                        await _studentRepository.UpdateStudentAsync(student);
                    }
                }
            }

            await _courseRepository.DeleteCourseAsync(id);

            return Ok(new { Message = "Course deleted successfully" });
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
