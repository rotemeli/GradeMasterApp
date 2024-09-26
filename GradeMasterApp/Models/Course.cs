using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace GradeMasterApp.Models
{
    public class Course
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string TeacherId { get; set; }
        public string CourseName { get; set; }
        public string Description { get; set; }
        public int NumberOfLectures { get; set; }
        public int AssignmentWeight { get; set; }
        public int FinalExamWeight { get; set; }
        public Exam? FinalExam { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public List<string> Enrollments { get; set; } = new List<string>();

        [BsonRepresentation(BsonType.ObjectId)]
        public List<string> Assignments { get; set; } = new List<string>();

        public List<CourseAttendance> AttendanceRecords { get; set; } = new List<CourseAttendance>();
    }
}
