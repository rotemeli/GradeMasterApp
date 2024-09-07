using GradeMasterApp.Models;
using GradeMasterApp.Services;
using MongoDB.Driver;

namespace GradeMasterApp.Repositories
{
    public class AttendanceRepository
    {
        private readonly IMongoCollection<Attendance> _attendanceCollection;

        public AttendanceRepository(MongoDBService mongoService)
        {
            _attendanceCollection = mongoService.GetDatabase().GetCollection<Attendance>("attendances");
        }
    }
}
