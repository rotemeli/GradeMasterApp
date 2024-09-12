using GradeMasterApp.Models;
using GradeMasterApp.Services;
using MongoDB.Driver;

namespace GradeMasterApp.Repositories
{
    public class StudentRepository
    {
        private readonly IMongoCollection<Student> _studentsCollection;

        public StudentRepository(MongoDBService mongoService)
        {
            _studentsCollection = mongoService.GetCollection<Student>("students");
        }

        // Add a new student to the database
        public async Task AddStudentAsync(Student student)
        {
            await _studentsCollection.InsertOneAsync(student);
        }

        // Get a student by their ID
        public async Task<Student> GetStudentByIdAsync(string studentId)
        {
            return await _studentsCollection.Find(s => s.Id == studentId).FirstOrDefaultAsync();
        }

        // Get a student by their StudentId (e.g., registration number)
        public async Task<Student> GetStudentByStudentIdAsync(long studentId)
        {
            return await _studentsCollection.Find(s => s.StudentId == studentId).FirstOrDefaultAsync();
        }

        // Update an existing student in the database
        public async Task UpdateStudentAsync(Student student)
        {
            var filter = Builders<Student>.Filter.Eq(s => s.Id, student.Id);
            await _studentsCollection.ReplaceOneAsync(filter, student);
        }

        // Get student by list of theirs ids
        public async Task<List<Student>> GetStudentsByIdsAsync(List<string> studentIds)
        {
            var filter = Builders<Student>.Filter.In(s => s.Id, studentIds);
            return await _studentsCollection.Find(filter).ToListAsync();
        }
    }
}
