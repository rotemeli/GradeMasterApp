using GradeMasterApp.Models;
using MongoDB.Driver;

namespace GradeMasterApp.Services
{
    public class StudentService
    {
        private readonly MongoDBService _context;
        private readonly IMongoCollection<Student> _studentsCollection;

        public StudentService(MongoDBService context)
        {
            _context = context;
            _studentsCollection = _context.GetCollection<Student>("students");
        }

        public async Task AddStudentsAsync(List<Student> students)
        {
            await _studentsCollection.InsertManyAsync(students);
        }

    }
}
