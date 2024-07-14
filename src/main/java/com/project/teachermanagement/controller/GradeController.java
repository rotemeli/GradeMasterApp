package com.project.teachermanagement.controller;

import com.project.teachermanagement.model.Grade;
import com.project.teachermanagement.service.GradeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grades")
public class GradeController {

    private final GradeService gradeService;

    public GradeController(GradeService gradeService) {
        this.gradeService = gradeService;
    }

    @PostMapping
    public Grade createGrade(@RequestBody Grade grade) {
        return gradeService.saveGrade(grade);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Grade> getGradeById(@PathVariable Long id) {
        return gradeService.getGradeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<Grade> getAllGrades() {
        return gradeService.getAllGrades();
    }

    @GetMapping("/student/{studentId}/course/{courseId}")
    public List<Grade> getGradesByStudentAndCourse(@PathVariable Long studentId, @PathVariable Long courseId) {
        return gradeService.getGradesByStudentAndCourse(studentId, courseId);
    }

    @GetMapping("/student/{studentId}/course/{courseId}/final")
    public double calculateFinalGrade(@PathVariable Long studentId, @PathVariable Long courseId) {
        return gradeService.calculateFinalGrade(studentId, courseId);
    }
}
