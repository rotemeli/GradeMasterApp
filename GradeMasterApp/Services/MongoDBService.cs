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

        public IMongoDatabase GetDatabase()
        {
            return _database;
        }

        public IMongoCollection<T> GetCollection<T>(string name)
        {
            return _database.GetCollection<T>(name);
        }

        public async Task CreateTeacherAsync(Teacher teacher)
        {
            var collection = GetCollection<Teacher>("teachers");
            await collection.InsertOneAsync(teacher);
        }

        public async Task<List<Teacher>> GetTeachersAsync()
        {
            var collection = GetCollection<Teacher>("teachers");
            return await collection.Find(new BsonDocument()).ToListAsync();
        }

        public async Task<Teacher> GetTeacherAsync(string email)
        {
            var collection = GetCollection<Teacher>("teachers");
            var filter = Builders<Teacher>.Filter.Eq(teacher => teacher.Email, email);
            return await collection.Find(filter).SingleOrDefaultAsync();
        }

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
