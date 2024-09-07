using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace GradeMasterApp.Models
{
    public class StudentAttendance
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string CourseId { get; set; }

        public List<Attendance> AttendanceDetails { get; set; } = new List<Attendance>();
    }
}
