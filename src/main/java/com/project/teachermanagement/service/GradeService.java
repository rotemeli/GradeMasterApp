package com.project.teachermanagement.service;

import com.project.teachermanagement.model.Grade;
import com.project.teachermanagement.repository.GradeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GradeService {
    private final GradeRepository gradeRepository;

    public GradeService(GradeRepository gradeRepository) {
        this.gradeRepository = gradeRepository;
    }

    public Grade saveGrade(Grade grade) {
        return gradeRepository.save(grade);
    }

    public Optional<Grade> getGradeById(Long id) {
        return gradeRepository.findById(id);
    }

    public List<Grade> getAllGrades() {
        return gradeRepository.findAll();
    }

    public List<Grade> getGradesByStudentAndCourse(Long studentId, Long courseId) {
        return gradeRepository.findByStudentIdAndAssignmentCourseId(studentId, courseId);
    }

    public double calculateFinalGrade(Long studentId, Long courseId) {
        List<Grade> grades = gradeRepository.findByStudentIdAndAssignmentCourseId(studentId, courseId);
        double totalWeight = grades.stream().mapToDouble(grade -> grade.getAssignment().getWeight()).sum();
        double finalGrade = grades.stream().mapToDouble(grade -> grade.getValue() * grade.getAssignment().getWeight()).sum();
        return totalWeight > 0 ? finalGrade / totalWeight : 0;
    }
}