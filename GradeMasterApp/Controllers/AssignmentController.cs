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

        public AssignmentController(AssignmentRepository assignmentRepository, CourseRepository courseRepository)
        {
            _assignmentRepository = assignmentRepository;
            _courseRepository = courseRepository;
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
    }
}
