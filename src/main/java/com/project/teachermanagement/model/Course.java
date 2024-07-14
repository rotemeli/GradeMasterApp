package com.project.teachermanagement.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
//    @JsonBackReference
    @JsonIgnore
    private Teacher teacher;

    @OneToMany(mappedBy = "course")
//    @JsonManagedReference
    @JsonIgnore
    private List<Student> students;

    @OneToMany(mappedBy = "course")
//    @JsonManagedReference
    @JsonIgnore
    private List<Lesson> lessons;

    @OneToMany(mappedBy = "course")
//    @JsonManagedReference
    @JsonIgnore
    private List<Assignment> assignments;
}

