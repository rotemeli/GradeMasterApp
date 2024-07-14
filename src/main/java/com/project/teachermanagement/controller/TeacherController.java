package com.project.teachermanagement.controller;

import com.project.teachermanagement.model.Teacher;
import com.project.teachermanagement.service.TeacherService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {
    private final TeacherService teacherService;

    private final PasswordEncoder passwordEncoder;

    public TeacherController(TeacherService teacherService, PasswordEncoder passwordEncoder) {
        this.teacherService = teacherService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping
    public Teacher createTeacher(@RequestBody Teacher teacher) {
        teacher.setPassword(passwordEncoder.encode(teacher.getPassword()));
        return teacherService.saveTeacher(teacher);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Teacher> getTeacherById(@PathVariable Long id) {
        return teacherService.getTeacherById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<Teacher> getAllTeachers() {
        return teacherService.getAllTeachers();
    }

}