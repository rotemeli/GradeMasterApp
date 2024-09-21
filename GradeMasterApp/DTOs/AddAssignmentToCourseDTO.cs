using GradeMasterApp.Models;

namespace GradeMasterApp.DTOs
{
    public class AddAssignmentToCourseDTO
    {
        public string CourseId { get; set; }
        public AssignmentDTO Assignment { get; set; }
    }
}
