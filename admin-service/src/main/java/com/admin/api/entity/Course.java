package com.admin.api.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(
    name = "course",
    uniqueConstraints = @UniqueConstraint(
        columnNames = {"course_name", "program_type"}
    )
)
@EntityListeners(AuditingEntityListener.class)
@Data
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "course_name", nullable = false)
    private String courseName;

    @Column(nullable = false)
    private Double price;

    @Column(name = "domain_code", nullable = false)
    private String domainCode;

    @Column(name = "program_type", nullable = false)
    private String programType;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime modifiedAt;
}