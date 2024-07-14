package com.project.teachermanagement.repository;

import com.project.teachermanagement.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
}
