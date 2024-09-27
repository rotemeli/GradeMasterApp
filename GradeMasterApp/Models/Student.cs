using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace GradeMasterApp.Models
{
    public class Student
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public long StudentId { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public List<string> Enrollments { get; set; } = new List<string>();

        public List<StudentAttendance> Attendances { get; set; } = new List<StudentAttendance>();
        public List<AssignmentSubmission> AssignmentsSubmissions { get; set; } = new List<AssignmentSubmission>();
        public List<FinalGrade> FinalGrades { get; set; } = new List<FinalGrade>();
    }
}
