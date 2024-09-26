using GradeMasterApp.Models;
using GradeMasterApp.Services;
using MongoDB.Driver;

namespace GradeMasterApp.Repositories
{
    public class ExamRepository
    {
        private readonly IMongoCollection<Exam> _examsCollection;

        public ExamRepository(MongoDBService mongoService)
        {
            _examsCollection = mongoService.GetCollection<Exam>("exams");
        }

        // Add a new exam to the database
        public async Task AddExamAsync(Exam exam)
        {
            await _examsCollection.InsertOneAsync(exam);
        }

        // Get an exam by the course ID
        public async Task<Exam?> GetExamByCourseIdAsync(string courseId)
        {
            var filter = Builders<Exam>.Filter.Eq(exam => exam.CourseId, courseId);
            return await _examsCollection.Find(filter).FirstOrDefaultAsync();
        }

        // Get an exam by its ID
        public async Task<Exam> GetExamByIdAsync(string examId)
        {
            return await _examsCollection.Find(e => e.Id == examId).FirstOrDefaultAsync();
        }

        // Update an existing exam in the database
        public async Task UpdateExamAsync(Exam exam)
        {
            var filter = Builders<Exam>.Filter.Eq(a => a.Id, exam.Id);
            await _examsCollection.ReplaceOneAsync(filter, exam);
        }

        // Delete an exam by its ID
        public async Task DeleteExamAsync(string examId)
        {
            var filter = Builders<Exam>.Filter.Eq(ex => ex.Id, examId);
            await _examsCollection.DeleteOneAsync(filter);
        }
    }
}
