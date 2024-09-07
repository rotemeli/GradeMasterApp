namespace GradeMasterApp.DTOs
{
    public class AddStudentToCourseDTO
    {
        public string CourseId { get; set; }
        public StudentDTO Student { get; set; }
    }
}
