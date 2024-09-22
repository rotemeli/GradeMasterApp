using GradeMasterApp.Models;
using GradeMasterApp.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace GradeMasterApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssignmentSubmissionController : ControllerBase
    {
        private readonly StudentRepository _studentRepository;

        public AssignmentSubmissionController(StudentRepository studentRepository)
        {
            _studentRepository = studentRepository;
        }

        // Add a new assignment submission
        [HttpPost("add-submission/{studentId}")]
        public async Task<IActionResult> AddSubmission(string studentId, [FromBody] AssignmentSubmission newSubmission)
        {
            if (newSubmission == null || string.IsNullOrWhiteSpace(newSubmission.AssignmentId))
            {
                return BadRequest("Invalid submission data.");
            }

            newSubmission.StudentId = studentId;

            // Add the new submission to the student
            await _studentRepository.AddAssignmentSubmissionAsync(studentId, newSubmission);

            return Ok(newSubmission);
        }

        // Add or update assignment submission for a student
        [HttpPut("update-submission")]
        public async Task<IActionResult> UpdateAssignmentSubmission([FromBody] AssignmentSubmission updatedSubmission)
        {
            await _studentRepository.UpdateAssignmentSubmissionAsync(updatedSubmission.StudentId, updatedSubmission);
            return Ok(new { Message = "Grade updated successfully" });
        }
    }
}
