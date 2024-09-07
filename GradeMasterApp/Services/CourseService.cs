using GradeMasterApp.DTOs;
using GradeMasterApp.Models;
using GradeMasterApp.Repositories;
using MongoDB.Driver;

namespace GradeMasterApp.Services
{
    public class CourseService
    {
        private readonly CourseRepository _courseRepository;

        public CourseService(CourseRepository courseRepository)
        {
            _courseRepository = courseRepository;
        }

        public async Task CreateCourseAsync(CourseDTO courseDto)
        {
            var course = new Course
            {
                TeacherId = courseDto.TeacherId,
                CourseName = courseDto.CourseName,
                Description = courseDto.Description,
                NumberOfLectures = courseDto.NumberOfLectures
            };

            await _courseRepository.AddCourseAsync(course);
        }
    }
}
