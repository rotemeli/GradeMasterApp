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
    }
}
