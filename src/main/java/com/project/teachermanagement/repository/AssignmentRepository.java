package com.project.teachermanagement.repository;

import com.project.teachermanagement.model.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
}
