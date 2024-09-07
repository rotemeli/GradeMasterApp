using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace GradeMasterApp.Models
{
    public class CourseAttendance
    {
        public long StudentId { get; set; }

        public List<Attendance> AttendanceDetails { get; set; } = new List<Attendance>();
    }
}
