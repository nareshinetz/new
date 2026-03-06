package com.admin.api.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CourseRequest {

    @NotBlank(message = "Course name must not be empty")
    @Size(min = 3, max = 100)
    private String courseName;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be greater than 0")
    private Double price;

    @NotBlank(message = "Domain code is required")
    private String domainCode;

    @NotBlank(message = "ProgramType is required")
    @Size(min = 3, max = 20)
    private String programType;
}