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

        public GradeController(AssignmentRepository assignmentRepository, StudentRepository studentRepository)
        {
            _assignmentRepository = assignmentRepository;
            _studentRepository = studentRepository;
        }

        [HttpPost("update-grades")]
        public async Task<IActionResult> UpdateGrades([FromBody] GradesDTO gradesReport)
        {
            if (gradesReport == null || gradesReport.Grades == null || !gradesReport.Grades.Any())
            {
                return BadRequest("Invalid grades report data.");
            }

            var tasks = new List<Task>();

            foreach (var studentGrade in gradesReport.Grades)
            {
                tasks.Add(ProcessGradeUpdateAsync(gradesReport.TaskId, studentGrade));
            }

            await Task.WhenAll(tasks);

            return Ok(new { Message = "Grades updated successfully" });
        }

        private async Task ProcessGradeUpdateAsync(string taskId, StudentGrade studentGrade)
        {
            var student = await _studentRepository.GetStudentByStudentIdAsync(studentGrade.StudentId).ConfigureAwait(false);

            if (student == null)
            {
                throw new Exception($"Student with ID {studentGrade.StudentId} not found.");  // Handle appropriately
            }

            // Create a new assignment submission or update an existing one
            var submission = new AssignmentSubmission
            {
                AssignmentId = taskId,
                StudentId = student.Id,
                Grade = studentGrade.Grade,
                SubmissionDate = DateTime.Now
            };

            await _studentRepository.AddOrUpdateAssignmentSubmissionAsync(student.Id, submission).ConfigureAwait(false);
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
