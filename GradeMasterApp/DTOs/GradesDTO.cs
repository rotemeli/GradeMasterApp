namespace GradeMasterApp.DTOs
{
    public class GradesDTO
    {
        public string TaskId { get; set; }
        public List<StudentGrade> Grades { get; set; }
    }

    public class StudentGrade
    {
        public long StudentId { get; set; }
        public double Grade { get; set; }
    }
}
