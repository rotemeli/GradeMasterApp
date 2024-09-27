using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace GradeMasterApp.Models
{
    public class FinalGrade
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string CourseId { get; set; }

        public double FinalGradeValue { get; set; }
        public DateTime SubmittedDate { get; set; } = DateTime.Now;
    }
}
