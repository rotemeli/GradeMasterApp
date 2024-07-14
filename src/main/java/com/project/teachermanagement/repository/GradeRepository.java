package com.project.teachermanagement.repository;

import com.project.teachermanagement.model.Grade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByStudentIdAndAssignmentCourseId(Long studentId, Long courseId);

}
