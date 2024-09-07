using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace GradeMasterApp.Models
{
    public class AssignmentSubmission
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string AssignmentId { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string StudentId { get; set; }
        public DateTime SubmissionDate { get; set; }
        public string SubmissionContent { get; set; }
        public double? Grade { get; set; }
        public string Feedback { get; set; }
    }
}
