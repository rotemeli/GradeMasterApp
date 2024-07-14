package com.project.teachermanagement.repository;

import com.project.teachermanagement.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
}
