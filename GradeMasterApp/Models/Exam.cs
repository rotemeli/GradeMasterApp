using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace GradeMasterApp.Models
{
    public class Exam
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string CourseId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime ExamDate { get; set; }
        public string ExamType { get; set; }
    }
}
