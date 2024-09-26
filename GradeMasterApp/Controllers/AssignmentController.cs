using GradeMasterApp.DTOs;
using GradeMasterApp.Models;
using GradeMasterApp.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GradeMasterApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssignmentController : ControllerBase
    {
        private readonly AssignmentRepository _assignmentRepository;
        private readonly CourseRepository _courseRepository;
        private readonly StudentRepository _studentRepository;

        public AssignmentController(AssignmentRepository assignmentRepository, CourseRepository courseRepository, StudentRepository studentRepository)
        {
            _assignmentRepository = assignmentRepository;
            _courseRepository = courseRepository;
            _studentRepository = studentRepository;
        }

        [HttpPost("add-new-assignment")]
        public async Task<IActionResult> CreateAssignment([FromBody] AddAssignmentToCourseDTO dto)
        {

            if (dto == null || dto.Assignment == null || string.IsNullOrEmpty(dto.CourseId))
            {
                return BadRequest("Assignment data is missing.");
            }

            var course = await _courseRepository.GetCourseByIdAsync(dto.CourseId);
            if (course == null)
            {
                return NotFound("Course not found.");
            }

            var assignment = new Assignment
            {
                CourseId = dto.CourseId,
                Title = dto.Assignment.Title,
                Description = dto.Assignment.Description,
                DueDate = dto.Assignment.DueDate,
            };

            await _assignmentRepository.AddAssignmentAsync(assignment);

            course.Assignments.Add(assignment.Id);
            await _courseRepository.UpdateCourseAsync(course);

            return Ok(assignment);
        }

        // Get all assignments for a specific course
        [HttpGet("get-course-assignments/{courseId}")]
        public async Task<IActionResult> GetCourseAssignments([FromRoute] string courseId)
        {
            var assignments = await _assignmentRepository.GetAssignmentsByCourseIdAsync(courseId);
            if (assignments == null || !assignments.Any())
            {
                return NotFound("No assignments found for this course.");
            }

            return Ok(assignments);
        }

        // Update a assignment by id
        [HttpPut("update-assignment/{id}")]
        public async Task<IActionResult> UpdateAssignment([FromRoute] string id, [FromBody] AddAssignmentToCourseDTO assignmentDto)
        {
            if (assignmentDto == null || string.IsNullOrEmpty(id))
            {
                return BadRequest("Invalid assignment data.");
            }

            // Find the assignment by ID
            var assignment = await _assignmentRepository.GetAssignmentByIdAsync(id);
            if (assignment == null)
            {
                return NotFound("Assignment not found.");
            }

            assignment.Title = assignmentDto.Assignment.Title;
            assignment.Description = assignmentDto.Assignment.Description;
            assignment.DueDate = assignmentDto.Assignment.DueDate;

            await _assignmentRepository.UpdateAssignmentAsync(assignment);

            return Ok(assignment);
        }

        // Delete an assignment by id
        [HttpDelete("delete-assignment/{assignmentId}/{courseId}")]
        public async Task<IActionResult> DeleteAssignment([FromRoute] string assignmentId, [FromRoute] string courseId)
        {
            // Find the assignment by ID
            var assignment = await _assignmentRepository.GetAssignmentByIdAsync(assignmentId);
            if (assignment == null)
            {
                return NotFound("Assignment not found.");
            }

            var course = await _courseRepository.GetCourseByIdAsync(courseId);
            if (course == null)
            {
                return NotFound("Course not found.");
            }

            // Remove assignment from the course
            course.Assignments.Remove(assignmentId);
            await _courseRepository.UpdateCourseAsync(course);

            var tasks = new List<Task>();

            var studentsWithSubmission = await _studentRepository.GetStudentsByAssignmentIdAsync(assignmentId);

            foreach (var student in studentsWithSubmission)
            {
                tasks.Add(RemoveAssignmentSubmissionFromStudentAsync(student, assignmentId));
            }

            tasks.Add(_assignmentRepository.DeleteAssignmentAsync(assignmentId));

            await Task.WhenAll(tasks);

            return Ok(new { Message = "Assignment deleted successfully" });
        }

        private async Task RemoveAssignmentSubmissionFromStudentAsync(Student student, string assignmentId)
        {
            student.AssignmentsSubmissions.RemoveAll(sub => sub.AssignmentId == assignmentId);

            await _studentRepository.UpdateStudentAsync(student);
        }
    }
}
