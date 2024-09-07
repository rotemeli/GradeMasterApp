using GradeMasterApp.Models;
using GradeMasterApp.Services;
using MongoDB.Driver;

namespace GradeMasterApp.Repositories
{
    public class EnrollmentRepository
    {
        private readonly IMongoCollection<Enrollment> _enrollmentCollection;

        public EnrollmentRepository(MongoDBService mongoService)
        {
            _enrollmentCollection = mongoService.GetCollection<Enrollment>("enrollments");
        }

        // Add a new enrollment to the database
        public async Task AddEnrollmentAsync(Enrollment enrollment)
        {
            await _enrollmentCollection.InsertOneAsync(enrollment);
        }

        // Get an enrollment by its ID
        public async Task<Enrollment> GetEnrollmentByIdAsync(string enrollmentId)
        {
            return await _enrollmentCollection.Find(e => e.Id == enrollmentId).FirstOrDefaultAsync();
        }

        // Delete an enrollment by its ID
        public async Task DeleteEnrollmentAsync(string enrollmentId)
        {
            var filter = Builders<Enrollment>.Filter.Eq(e => e.Id, enrollmentId);
            await _enrollmentCollection.DeleteOneAsync(filter);
        }

        // Get all enrollments for a specific course
        public async Task<List<Enrollment>> GetEnrollmentsByCourseIdAsync(string courseId)
        {
            return await _enrollmentCollection.Find(e => e.CourseId == courseId).ToListAsync();
        }

        // Get an enrollment by CourseId and StudentId
        public async Task<Enrollment> GetEnrollmentAsync(string courseId, string studentId)
        {
            var filter = Builders<Enrollment>.Filter.And(
                Builders<Enrollment>.Filter.Eq(e => e.CourseId, courseId),
                Builders<Enrollment>.Filter.Eq(e => e.StudentId, studentId)
            );

            return await _enrollmentCollection.Find(filter).FirstOrDefaultAsync();
        }
    }
}
