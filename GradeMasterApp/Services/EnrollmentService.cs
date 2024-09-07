using GradeMasterApp.DTOs;
using GradeMasterApp.Models;
using GradeMasterApp.Repositories;

namespace GradeMasterApp.Services
{
    public class EnrollmentService
    {
        private readonly EnrollmentRepository _enrollmentRepository;
        private readonly StudentRepository _studentRepository;

        public EnrollmentService(EnrollmentRepository enrollmentRepository, StudentRepository studentRepository)
        {
            _enrollmentRepository = enrollmentRepository;
            _studentRepository = studentRepository;
        }

        public async Task EnrollStudentsInCourseAsync(string courseId, List<StudentDTO> studentsDto)
        {
            foreach (var studentDto in studentsDto)
            {
                // Find the student by StudentId or create a new one
                var student = await _studentRepository.GetStudentByStudentIdAsync(studentDto.StudentId)
                              ?? new Student
                              {
                                  FirstName = studentDto.FirstName,
                                  LastName = studentDto.LastName,
                                  StudentId = studentDto.StudentId
                              };

                // Add the student if they are new
                if (student.Id == null)
                {
                    await _studentRepository.AddStudentAsync(student);
                }

                // Create the enrollment
                var enrollment = new Enrollment
                {
                    CourseId = courseId,
                    StudentId = student.Id,
                    EnrollmentDate = DateTime.UtcNow
                };

                await _enrollmentRepository.AddEnrollmentAsync(enrollment);

                // Update student's enrollments
                student.Enrollments.Add(enrollment.Id);
                await _studentRepository.UpdateStudentAsync(student);
            }
        }
    }

}
