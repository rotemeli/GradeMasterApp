using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace GradeMasterApp.Models
{
    public class ExamSubmission
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string ExamId { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string StudentId { get; set; }
        public DateTime SubmissionDate { get; set; }
        public double? Grade { get; set; }
    }
}
