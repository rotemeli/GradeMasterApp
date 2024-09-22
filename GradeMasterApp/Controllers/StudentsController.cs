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
    public class StudentsController : ControllerBase
    {
        private readonly StudentRepository _studentRepository;
        private readonly EnrollmentRepository _enrollmentRepository;
        private readonly CourseRepository _courseRepository;

        public StudentsController(StudentRepository studentRepository, EnrollmentRepository enrollmentRepository, CourseRepository courseRepository)
        {
            _studentRepository = studentRepository;
            _enrollmentRepository = enrollmentRepository;
            _courseRepository = courseRepository;
        }

        [HttpGet("get-students-by-course/{courseId}")]
        public async Task<IActionResult> GetStudentsByCourse(string courseId)
        {
            var enrollments = await _enrollmentRepository.GetEnrollmentsByCourseIdAsync(courseId);

            // Extract the list of StudentIds from the enrollments
            var studentIds = enrollments.Select(e => e.StudentId).ToList();

            if (!studentIds.Any())
            {
                return NotFound("No students found for this course.");
            }

            // Get students by the list of StudentIds
            var students = await _studentRepository.GetStudentsByIdsAsync(studentIds);

            return Ok(students);
        }

        [HttpPost("add-new-student")]
        public async Task<IActionResult> AddNewStudent([FromBody] AddStudentToCourseDTO dto)
        {
            if (dto == null || dto.Student == null || string.IsNullOrEmpty(dto.CourseId))
            {
                return BadRequest("Invalid student or course data.");
            }

            var course = await _courseRepository.GetCourseByIdAsync(dto.CourseId);
            if (course == null)
            {
                return NotFound("Course not found.");
            }

            // Find the student by StudentId or create a new one if not found
            var student = await _studentRepository.GetStudentByStudentIdAsync(dto.Student.StudentId)
                           ?? new Student
                           {
                               FirstName = dto.Student.FirstName,
                               LastName = dto.Student.LastName,
                               StudentId = dto.Student.StudentId
                           };

            if (student.Id == null)
            {
                await _studentRepository.AddStudentAsync(student);
            }

            // Check if the student is already enrolled in the course
            var existingEnrollment = await _enrollmentRepository.GetEnrollmentAsync(course.Id, student.Id);
            if (existingEnrollment != null)
            {
                return BadRequest("Student is already enrolled in this course.");
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
            await _courseRepository.UpdateCourseAsync(course);

            return Ok(student);
        }

        [HttpDelete("remove-student-from-course/{courseId}/{studentId}")]
        public async Task<IActionResult> DeleteStudentFromCourse(string courseId, string studentId)
        {
            // Find the course by CourseId
            var course = await _courseRepository.GetCourseByIdAsync(courseId);
            if (course == null)
            {
                return NotFound("Course not found.");
            }

            // Find the student by StudentId
            var student = await _studentRepository.GetStudentByIdAsync(studentId);
            if (student == null)
            {
                return NotFound("Student not found.");
            }

            // Find the enrollment for the specific course and student
            var enrollment = await _enrollmentRepository.GetEnrollmentAsync(courseId, studentId);
            if (enrollment == null)
            {
                return BadRequest("Student is not enrolled in this course.");
            }

            // Remove the enrollment from the student
            student.Enrollments.Remove(enrollment.Id);
            await _studentRepository.UpdateStudentAsync(student);

            // Remove the enrollment from the course
            course.Enrollments.Remove(enrollment.Id);
            await _courseRepository.UpdateCourseAsync(course);

            await _enrollmentRepository.DeleteEnrollmentAsync(enrollment.Id);

            return Ok(new { Message = "Student removed from course successfully." });
        }
    }
}
