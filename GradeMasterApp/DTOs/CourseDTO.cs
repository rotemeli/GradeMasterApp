namespace GradeMasterApp.DTOs
{
    public class CourseDTO
    {
        public string TeacherId { get; set; }
        public string CourseName { get; set; }
        public string Description { get; set; }
        public int NumberOfLectures { get; set; }
        public List<StudentDTO> Students { get; set; }
        public int AssignmentsWeight { get; set; }
        public int FinalExamWeight { get; set; }
    }
}
