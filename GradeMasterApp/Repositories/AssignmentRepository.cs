using GradeMasterApp.Models;
using GradeMasterApp.Services;
using MongoDB.Driver;

namespace GradeMasterApp.Repositories
{
    public class AssignmentRepository
    {
        private readonly IMongoCollection<Assignment> _assignmentsCollection;

        public AssignmentRepository(MongoDBService mongoService)
        {
            _assignmentsCollection = mongoService.GetCollection<Assignment>("assignments");
        }

        // Add a new assignment to the database
        public async Task AddAssignmentAsync(Assignment assignment)
        {
            await _assignmentsCollection.InsertOneAsync(assignment);
        }

        // Get a assignments by course ID
        public async Task<List<Assignment>> GetAssignmentsByCourseIdAsync(string courseId)
        {
            var filter = Builders<Assignment>.Filter.Eq(a => a.CourseId, courseId);
            return await _assignmentsCollection.Find(filter).ToListAsync();
        }

        // Get a assignment by its ID
        public async Task<Assignment> GetAssignmentByIdAsync(string assignmentId)
        {
            return await _assignmentsCollection.Find(a => a.Id == assignmentId).FirstOrDefaultAsync();
        }

        // Update an existing assignment in the database
        public async Task UpdateAssignmentAsync(Assignment assignment)
        {
            var filter = Builders<Assignment>.Filter.Eq(a => a.Id, assignment.Id);
            await _assignmentsCollection.ReplaceOneAsync(filter, assignment);
        }
    }
}
