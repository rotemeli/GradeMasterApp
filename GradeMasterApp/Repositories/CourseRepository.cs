using GradeMasterApp.Models;
using GradeMasterApp.Services;
using MongoDB.Driver;

namespace GradeMasterApp.Repositories
{
    public class CourseRepository
    {
        private readonly IMongoCollection<Course> _coursesCollection;

        public CourseRepository(MongoDBService mongoService)
        {
            _coursesCollection = mongoService.GetCollection<Course>("courses");
        }

        // Add a new course to the database
        public async Task AddCourseAsync(Course course)
        {
            await _coursesCollection.InsertOneAsync(course);
        }

        // Get a course by its ID
        public async Task<Course> GetCourseByIdAsync(string courseId)
        {
            return await _coursesCollection.Find(c => c.Id == courseId).FirstOrDefaultAsync();
        }

        // Get a courses by teacher ID
        public async Task<List<Course>> GetCoursesByTeacherIdAsync(string teacherId)
        {
            var filter = Builders<Course>.Filter.Eq(c => c.TeacherId, teacherId);
            return await _coursesCollection.Find(filter).ToListAsync();
        }

        // Update an existing course in the database
        public async Task UpdateCourseAsync(Course course)
        {
            var filter = Builders<Course>.Filter.Eq(c => c.Id, course.Id);
            await _coursesCollection.ReplaceOneAsync(filter, course);
        }

        // Delete a course by its ID
        public async Task DeleteCourseAsync(string courseId)
        {
            var filter = Builders<Course>.Filter.Eq(c => c.Id, courseId);
            await _coursesCollection.DeleteOneAsync(filter);
        }
    }
}
