using GradeMasterApp.Data;
using GradeMasterApp.Models;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace GradeMasterApp.Services
{
    public class MongoDBService
    {
        private readonly IMongoDatabase _database;

        public MongoDBService(IOptions<MongoDBSettings> mongoSettings)
        {
            var client = new MongoClient(mongoSettings.Value.ConnectionString);
            _database = client.GetDatabase(mongoSettings.Value.DatabaseName);
        }

        // Method to return the MongoDB database instance
        public IMongoDatabase GetDatabase()
        {
            return _database;
        }

        // Generic method to retrieve a collection of a specific type by its name
        public IMongoCollection<T> GetCollection<T>(string name)
        {
            return _database.GetCollection<T>(name);
        }

        // Create a new Teacher object in the "teachers" collection
        public async Task CreateTeacherAsync(Teacher teacher)
        {
            var collection = GetCollection<Teacher>("teachers");
            await collection.InsertOneAsync(teacher);
        }

        // Returns all Teachers
        public async Task<List<Teacher>> GetTeachersAsync()
        {
            var collection = GetCollection<Teacher>("teachers");
            return await collection.Find(new BsonDocument()).ToListAsync();
        }

        // Get a Teacher by email
        public async Task<Teacher> GetTeacherAsync(string email)
        {
            var collection = GetCollection<Teacher>("teachers");
            var filter = Builders<Teacher>.Filter.Eq(teacher => teacher.Email, email);
            return await collection.Find(filter).SingleOrDefaultAsync();
        }

        // Update the password hash and salt for a specific teacher
        public async Task UpdateTeacherPasswordAsync(string teacherId, byte[] newPasswordHash, byte[] newPasswordSalt)
        {
            var collection = GetCollection<Teacher>("teachers");
            var filter = Builders<Teacher>.Filter.Eq(t => t.Id, teacherId);
            var update = Builders<Teacher>.Update
                .Set(t => t.PasswordHash, newPasswordHash)
                .Set(t => t.PasswordSalt, newPasswordSalt);

            await collection.UpdateOneAsync(filter, update);
        }
    }
}
