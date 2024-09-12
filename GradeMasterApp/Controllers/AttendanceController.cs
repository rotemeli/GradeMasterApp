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
        private readonly EnrollmentRepository _enrollmentRepository;

        public AttendanceController(StudentRepository studentRepository, CourseRepository courseRepository, EnrollmentRepository enrollmentRepository)
        {
            _studentRepository = studentRepository;
            _courseRepository = courseRepository;
            _enrollmentRepository = enrollmentRepository;
        }

        /// <summary>
        /// Updates the attendance records for both students and the course.
        /// </summary>
        /// <param name="attendanceReport"></param>
        /// <returns></returns>
        [HttpPost("update-attendance")]
        public async Task<IActionResult> UpdateAttendance([FromBody] List<List<AttendanceDTO>> attendanceReport)
        {
            if (attendanceReport == null || !attendanceReport.Any())
            {
                return BadRequest("Invalid attendance data.");
            }

            var courseId = attendanceReport.First().First().CourseId;
            var course = await _courseRepository.GetCourseByIdAsync(courseId);
            if (course == null)
                return NotFound("Course not found.");

            var enrollments = await _enrollmentRepository.GetEnrollmentsByCourseIdAsync(courseId);
            var studentIds = enrollments.Select(e => e.StudentId).ToList();

            if (!studentIds.Any())
            {
                return NotFound("No students found for this course.");
            }

            var students = await _studentRepository.GetStudentsByIdsAsync(studentIds);

            var tasks = new List<Task>();

            foreach (var attendanceDto in attendanceReport)
            {
                var student = students.FirstOrDefault(s => s.StudentId == attendanceDto.First().StudentId);
                if (student == null)
                {
                    return NotFound($"Student with ID {attendanceDto.First().StudentId} not found.");
                }

                var studentAttendanceRecord = student.Attendances.FirstOrDefault(a => a.CourseId == courseId)
                                              ?? new StudentAttendance { CourseId = courseId };

                if (!student.Attendances.Contains(studentAttendanceRecord))
                    student.Attendances.Add(studentAttendanceRecord);

                foreach (var attendance in attendanceDto)
                {
                    var studentAttendance = studentAttendanceRecord.AttendanceDetails.FirstOrDefault(a => a.LectureName == attendance.LectureName);
                    if (studentAttendance == null)
                    {
                        studentAttendanceRecord.AttendanceDetails.Add(new Attendance
                        {
                            LectureName = attendance.LectureName,
                            Status = attendance.Status
                        });
                    }
                    else
                    {
                        studentAttendance.Status = attendance.Status;
                    }

                    var courseAttendanceRecord = course.AttendanceRecords.FirstOrDefault(a => a.StudentId == attendance.StudentId)
                        ?? new CourseAttendance { StudentId = attendance.StudentId };

                    if (!course.AttendanceRecords.Contains(courseAttendanceRecord))
                        course.AttendanceRecords.Add(courseAttendanceRecord);

                    var courseAttendance = courseAttendanceRecord.AttendanceDetails.FirstOrDefault(a => a.LectureName == attendance.LectureName);
                    if (courseAttendance == null)
                    {
                        courseAttendanceRecord.AttendanceDetails.Add(new Attendance
                        {
                            LectureName = attendance.LectureName,
                            Status = attendance.Status
                        });
                    }
                    else
                    {
                        courseAttendance.Status = attendance.Status;
                    }
                }

                tasks.Add(_studentRepository.UpdateStudentAsync(student));
            }

            await Task.WhenAll(tasks);

            await _courseRepository.UpdateCourseAsync(course);

            return Ok(new { Message = "Attendance updated successfully" });
        }
    }
}
