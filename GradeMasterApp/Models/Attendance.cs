using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace GradeMasterApp.Models
{
    public class Attendance
    {
        public string LectureName { get; set; }
        public AttendanceStatus Status { get; set; }
    }

    public enum AttendanceStatus
    {
        NotSet = -1,
        Present = 0,
        Absent = 1,
        Late = 2
    }
}
