﻿using MongoDB.Bson.Serialization.Attributes;
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
        [BsonRepresentation(BsonType.ObjectId)]
        public List<string> ExamsSubmissions { get; set; } = new List<string>();
        [BsonRepresentation(BsonType.ObjectId)]
        public List<string> AssignmentsSubmissions { get; set; } = new List<string>();
        [BsonRepresentation(BsonType.ObjectId)]
        public List<string> FinalGrades { get; set; } = new List<string>();
        public List<StudentAttendance> Attendances { get; set; } = new List<StudentAttendance>();
    }
}
