using GradeMasterApp.DTOs;
using GradeMasterApp.Models;
using GradeMasterApp.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GradeMasterApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExamController : ControllerBase
    {
        private readonly ExamRepository _examRepository;
        private readonly CourseRepository _courseRepository;
        private readonly StudentRepository _studentRepository;

        public ExamController(ExamRepository examRepository, CourseRepository courseRepository, StudentRepository studentRepository)
        {
            _examRepository = examRepository;
            _courseRepository = courseRepository;
            _studentRepository = studentRepository;
        }

        [HttpPost("add-new-exam")]
        public async Task<IActionResult> CreateExam([FromBody] AddExamToCourseDTO dto)
        {
            if (dto == null || dto.Exam == null || string.IsNullOrEmpty(dto.CourseId))
            {
                return BadRequest("Exam data is missing.");
            }

            var course = await _courseRepository.GetCourseByIdAsync(dto.CourseId);
            if (course == null)
            {
                return NotFound("Course not found.");
            }

            var exam = new Exam
            {
                CourseId = dto.CourseId,
                Title = dto.Exam.Title,
                ExamDate = dto.Exam.ExamDate,
            };

            await _examRepository.AddExamAsync(exam);

            course.FinalExam = exam;
            await _courseRepository.UpdateCourseAsync(course);

            return Ok(exam);
        }

        [HttpGet("get-course-exam/{courseId}")]
        public async Task<IActionResult> GetExamByCourseId(string courseId)
        {
            var exam = await _examRepository.GetExamByCourseIdAsync(courseId);

            if (exam == null)
            {
                return NotFound("Exam not found for the given course ID.");
            }

            return Ok(exam);
        }

        // Update an exam by id
        [HttpPut("update-exam/{id}")]
        public async Task<IActionResult> UpdateExam([FromRoute] string id, [FromBody] AddExamToCourseDTO examDto)
        {
            if (examDto == null || string.IsNullOrEmpty(id))
            {
                return BadRequest("Invalid exam data.");
            }

            // Find the assignment by ID
            var exam = await _examRepository.GetExamByIdAsync(id);
            if (exam == null)
            {
                return NotFound("Exam not found.");
            }

            exam.Title = examDto.Exam.Title;
            exam.ExamDate = examDto.Exam.ExamDate;

            await _examRepository.UpdateExamAsync(exam);

            return Ok(exam);
        }

        // Delete an exam by id
        [HttpDelete("delete-exam/{examId}/{courseId}")]
        public async Task<IActionResult> DeleteExam([FromRoute] string examId, [FromRoute] string courseId)
        {
            // Find the exam by ID
            var exam = await _examRepository.GetExamByIdAsync(examId);
            if (exam == null)
            {
                return NotFound("Exam not found.");
            }

            var course = await _courseRepository.GetCourseByIdAsync(courseId);
            if (course == null)
            {
                return NotFound("Course not found.");
            }

            // Remove exam from the course
            course.FinalExam = null;
            await _courseRepository.UpdateCourseAsync(course);

            var tasks = new List<Task>();

            var studentsWithSubmission = await _studentRepository.GetStudentsByExamIdAsync(examId);

            foreach (var student in studentsWithSubmission)
            {
                tasks.Add(RemoveExamSubmissionFromStudentAsync(student, examId));
            }

            tasks.Add(_examRepository.DeleteExamAsync(examId));

            await Task.WhenAll(tasks);

            return Ok(new { Message = "Exam deleted successfully" });
        }

        private async Task RemoveExamSubmissionFromStudentAsync(Student student, string examId)
        {
            if (student.ExamSubmission != null && student.ExamSubmission.ExamId == examId)
            {
                student.ExamSubmission = null;

                await _studentRepository.UpdateStudentAsync(student);
            }
        }
    }
}
