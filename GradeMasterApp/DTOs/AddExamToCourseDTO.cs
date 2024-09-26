namespace GradeMasterApp.DTOs
{
    public class AddExamToCourseDTO
    {
        public string CourseId { get; set; }
        public ExamDTO Exam { get; set; }
    }
}
