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

        // Add a new assignment submission
        public async Task AddAssignmentSubmissionAsync(string studentId, AssignmentSubmission submission)
        {
            var filter = Builders<Student>.Filter.Eq(s => s.Id, studentId);
            var update = Builders<Student>.Update.Push(s => s.AssignmentsSubmissions, submission);

            await _studentsCollection.UpdateOneAsync(filter, update);
        }

        // Update an existing assignment submission
        public async Task UpdateAssignmentSubmissionAsync(string studentId, AssignmentSubmission updatedSubmission)
        {
            var filter = Builders<Student>.Filter.Eq(s => s.Id, studentId) &
                         Builders<Student>.Filter.Eq("AssignmentsSubmissions.AssignmentId", updatedSubmission.AssignmentId);

            var update = Builders<Student>.Update
                .Set("AssignmentsSubmissions.$.Grade", updatedSubmission.Grade)
                .Set("AssignmentsSubmissions.$.Feedback", updatedSubmission.Feedback)
                .Set("AssignmentsSubmissions.$.SubmissionDate", updatedSubmission.SubmissionDate);

            var result = await _studentsCollection.UpdateOneAsync(filter, update);
        }

        // Add a new submission or update an existing submission
        public async Task AddOrUpdateAssignmentSubmissionAsync(string studentId, AssignmentSubmission submission)
        {
            var filter = Builders<Student>.Filter.Eq(s => s.Id, studentId) &
                         Builders<Student>.Filter.ElemMatch(s => s.AssignmentsSubmissions, sub => sub.AssignmentId == submission.AssignmentId);

            var existingStudent = await _studentsCollection.Find(filter).FirstOrDefaultAsync();

            if (existingStudent != null)
            {
                // If the submission exists, update the grade
                var update = Builders<Student>.Update
                    .Set("AssignmentsSubmissions.$.Grade", submission.Grade)
                    .Set("AssignmentsSubmissions.$.SubmissionDate", submission.SubmissionDate);

                await _studentsCollection.UpdateOneAsync(filter, update);
            }
            else
            {
                // If the submission does not exist, add a new one
                var pushSubmission = Builders<Student>.Update.Push(s => s.AssignmentsSubmissions, submission);

                await _studentsCollection.UpdateOneAsync(
                    Builders<Student>.Filter.Eq(s => s.Id, studentId),
                    pushSubmission
                );
            }
        }

    }
}
