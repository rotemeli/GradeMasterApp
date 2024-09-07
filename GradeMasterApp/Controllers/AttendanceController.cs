using GradeMasterApp.DTOs;
using GradeMasterApp.Models;
using GradeMasterApp.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GradeMasterApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController : ControllerBase
    {
        private readonly StudentRepository _studentRepository;
        private readonly CourseRepository _courseRepository;

        public AttendanceController(StudentRepository studentRepository, CourseRepository courseRepository)
        {
            _studentRepository = studentRepository;
            _courseRepository = courseRepository;
        }

        /// <summary>
        /// Updates the attendance records for both students and the course.
        /// </summary>
        /// <param name="attendanceReport"></param>
        /// <returns></returns>
        [HttpPost("update-attendance")]
        public async Task<IActionResult> UpdateAttendance([FromBody] List<AttendanceDTO> attendanceReport)
        {
            if (attendanceReport == null || !attendanceReport.Any())
            {
                return BadRequest("Invalid attendance data.");
            }

            var courseId = attendanceReport.First().CourseId;

            var course = await _courseRepository.GetCourseByIdAsync(courseId);
            if (course == null)
                return NotFound("Course not found.");

            foreach (var attendanceDto in attendanceReport)
            {
                var student = await _studentRepository.GetStudentByStudentIdAsync(attendanceDto.StudentId);
                if (student == null)
                {
                    return NotFound($"Student with ID {attendanceDto.StudentId} not found.");
                }

                // Update student's attendance
                var studentAttendanceRecord = student.Attendances.FirstOrDefault(a => a.CourseId == courseId);
                if (studentAttendanceRecord == null)
                {
                    studentAttendanceRecord = new StudentAttendance { CourseId = courseId };
                    student.Attendances.Add(studentAttendanceRecord);
                }

                var studentAttendance = studentAttendanceRecord.AttendanceDetails.FirstOrDefault(a => a.LectureName == attendanceDto.LectureName);
                if (studentAttendance == null)
                {
                    studentAttendance = new Attendance
                    {
                        LectureName = attendanceDto.LectureName,
                        Status = attendanceDto.Status
                    };
                    studentAttendanceRecord.AttendanceDetails.Add(studentAttendance);
                }
                else
                {
                    studentAttendance.Status = attendanceDto.Status;
                }

                await _studentRepository.UpdateStudentAsync(student);

                // Update course's attendance
                var courseAttendanceRecord = course.AttendanceRecords.FirstOrDefault(a => a.StudentId == attendanceDto.StudentId);
                if (courseAttendanceRecord == null)
                {
                    courseAttendanceRecord = new CourseAttendance { StudentId = attendanceDto.StudentId };
                    course.AttendanceRecords.Add(courseAttendanceRecord);
                }

                var courseAttendance = courseAttendanceRecord.AttendanceDetails.FirstOrDefault(a => a.LectureName == attendanceDto.LectureName);
                if (courseAttendance == null)
                {
                    courseAttendance = new Attendance
                    {
                        LectureName = attendanceDto.LectureName,
                        Status = attendanceDto.Status
                    };
                    courseAttendanceRecord.AttendanceDetails.Add(courseAttendance);
                }
                else
                {
                    courseAttendance.Status = attendanceDto.Status;
                }

                await _courseRepository.UpdateCourseAsync(course);
            }

            return Ok(new { Message = "Attendance updated successfully" });
        }
    }
}
