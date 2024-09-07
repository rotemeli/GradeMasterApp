using GradeMasterApp.Models;

namespace GradeMasterApp.DTOs
{
    public class AttendanceDTO
    {
        public long StudentId { get; set; }

        public string CourseId { get; set; }

        public string LectureName { get; set; }

        public AttendanceStatus Status { get; set; }
    }
}
