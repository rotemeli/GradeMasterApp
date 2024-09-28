using GradeMasterApp.DTOs;
using GradeMasterApp.Models;
using GradeMasterApp.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GradeMasterApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GradeController : ControllerBase
    {
        private readonly AssignmentRepository _assignmentRepository;
        private readonly StudentRepository _studentRepository;
        private readonly ExamRepository _examRepository;
        private readonly EnrollmentRepository _enrollmentRepository;

        public GradeController(AssignmentRepository assignmentRepository, StudentRepository studentRepository, ExamRepository examRepository, EnrollmentRepository enrollmentRepository)
        {
            _assignmentRepository = assignmentRepository;
            _studentRepository = studentRepository;
            _examRepository = examRepository;
            _enrollmentRepository = enrollmentRepository;
        }

        [HttpPost("update-grades")]
        public async Task<IActionResult> UpdateGrades([FromBody] GradesDTO gradesReport)
        {
            if (gradesReport == null || gradesReport.Grades == null || !gradesReport.Grades.Any())
            {
                return BadRequest("Invalid grades report data.");
            }

            // Fetch assignment or exam
            var assignment = await _assignmentRepository.GetAssignmentByIdAsync(gradesReport.TaskId).ConfigureAwait(false);
            var exam = assignment == null ? await _examRepository.GetExamByIdAsync(gradesReport.TaskId).ConfigureAwait(false) : null;

            if (assignment == null && exam == null)
            {
                return BadRequest("No assignment or exam found with the given task ID.");
            }

            var courseId = assignment?.CourseId ?? exam?.CourseId;
            if (courseId == null)
            {
                return BadRequest("Invalid course ID.");
            }

            var tasks = new List<Task<string?>>();
            var skippedStudents = new List<string>();

            foreach (var studentGrade in gradesReport.Grades)
            {
                tasks.Add(ProcessGradeUpdateAsync(courseId, gradesReport.TaskId, studentGrade));
            }

            var results = await Task.WhenAll(tasks);

            // Collect students who were not enrolled or not found
            foreach (var result in results)
            {
                if (result != null) skippedStudents.Add(result);
            }

            if (skippedStudents.Count == gradesReport.Grades.Count)
            {
                return BadRequest(new { Message = "No grades were updated. All students were either not enrolled or not found." });
            }

            if (skippedStudents.Count > 0)
            {
                return Ok(new
                {
                    Message = "Grades updated successfully, but some students were skipped.",
                    SkippedStudents = skippedStudents
                });
            }

            return Ok(new { Message = "Grades updated successfully for all students." });
        }

        private async Task<string?> ProcessGradeUpdateAsync(string courseId, string taskId, StudentGrade studentGrade)
        {
            var student = await _studentRepository.GetStudentByStudentIdAsync(studentGrade.StudentId).ConfigureAwait(false);

            if (student == null)
            {
                Console.WriteLine($"Student with ID {studentGrade.StudentId} not found.");
                return studentGrade.StudentId.ToString();
            }

            // Check if the student is enrolled in the course
            var isEnrolled = await IsStudentEnrolledInCourseAsync(student, courseId);

            if (!isEnrolled)
            {
                Console.WriteLine($"Student with ID {studentGrade.StudentId} is not enrolled in course {courseId}.");
                return studentGrade.StudentId.ToString();
            }

            // Create a new assignment or exam submission
            var submission = new AssignmentSubmission
            {
                AssignmentId = taskId,
                StudentId = student.Id,
                Grade = studentGrade.Grade,
                SubmissionDate = DateTime.Now
            };

            await _studentRepository.AddOrUpdateAssignmentSubmissionAsync(student.Id, submission).ConfigureAwait(false);

            return null;  // Return null if successful
        }

        private async Task<bool> IsStudentEnrolledInCourseAsync(Student student, string courseId)
        {
            // Check if the student has an enrollment for the given course
            var enrollment = await _enrollmentRepository.GetEnrollmentAsync(courseId, student.Id).ConfigureAwait(false);

            return enrollment != null;
        }

        [HttpGet("course-final-grades/{courseId}")]
        public async Task<IActionResult> GetCourseFinalGrades(string courseId)
        {
            var finalGrades = await _studentRepository.GetFinalGradesByCourseIdAsync(courseId);

            if (finalGrades == null || !finalGrades.Any())
            {
                return NotFound($"No final grades found for course with ID {courseId}.");
            }

            return Ok(finalGrades);
        }
    }
}
