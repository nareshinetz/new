package com.admin.api.serviceimpl;

import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.admin.api.entity.Batch;
import com.admin.api.entity.Course;
import com.admin.api.entity.Student;
import com.admin.api.entity.StudentFees;
import com.admin.api.model.StudentRequest;
import com.admin.api.repository.BatchRepository;
import com.admin.api.repository.CourseRepository;
import com.admin.api.repository.StudentFeesRepository;
import com.admin.api.repository.StudentRepository;
import com.admin.api.service.StudentService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class StudentServiceImp implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepo;

    @Autowired
    private StudentFeesRepository feesRepo;

    @Autowired
    private BatchRepository batchRepository;

    @Autowired
    private ModelMapper mapper;

    @Override
    public Student createStudent(StudentRequest request) {

        // 1️⃣ Email & Phone validation
        if (studentRepository.existsByEmailId(request.getEmailId()))
            throw new RuntimeException("Email already exists");

        if (studentRepository.existsByPhoneNumber(request.getPhoneNumber()))
            throw new RuntimeException("Phone already exists");

        // 2️⃣ Validate ProgramType provided
        if (request.getProgramType() == null || request.getProgramType().isEmpty())
            throw new RuntimeException("ProgramType must be provided");

        // 3️⃣ Check Course exists
        Course courseByName = courseRepo
                .findByCourseName(request.getCourseName())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // 4️⃣ Check ProgramType exists for that course
        Course course = courseRepo
                .findByCourseNameAndProgramType(
                        request.getCourseName(),
                        request.getProgramType())
                .orElseThrow(() -> new RuntimeException("ProgramType not found for this course"));

        // 5️⃣ Get Batch
        Batch batch = batchRepository.findById(request.getBatchId())
                .orElseThrow(() -> new RuntimeException("Batch not found"));

        // 6️⃣ Generate Student ID

        // First letter of programType
        String programCode = request.getProgramType()
                .substring(0, 1)
                .toUpperCase();

        // Count students based on course + programType
        long count = studentRepository
                .countByProgramTypeAndCourse_CourseName(
                        request.getProgramType(),
                        request.getCourseName()) + 1;

        String studentId = "I"
                + programCode
                + course.getDomainCode().toUpperCase()
                + String.format("%04d", count);

        // 7️⃣ Map Student & Set Relations
        Student student = mapper.map(request, Student.class);
        student.setId(studentId);
        student.setCourse(course);
        student.setBatch(batch);

        Student savedStudent = studentRepository.save(student);

        // 8️⃣ Fees Calculation
        Double totalFees = course.getPrice();
        Double discount = request.getDiscount() == null ? 0.0 : request.getDiscount();

        if (discount > totalFees)
            throw new RuntimeException("Discount cannot exceed total fees");

        Double actualFees = totalFees - discount;

        // 9️⃣ Create StudentFees
        StudentFees fees = new StudentFees();
        fees.setStudent(savedStudent);
        fees.setTotalFees(totalFees);
        fees.setActualFees(actualFees);
        fees.setPaidAmount(0.0);
        fees.setPendingAmount(actualFees);
        fees.setStatus("PENDING");

        feesRepo.save(fees);

        return savedStudent;
    }

    @Override
    public Optional<Student> getStudentById(String id) {
        return studentRepository.findById(id);
    }

    @Override
    public Student updateStudentById(String id, StudentRequest request) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Check Course exists
        courseRepo.findByCourseName(request.getCourseName())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Check ProgramType exists for that course
        Course course = courseRepo
                .findByCourseNameAndProgramType(
                        request.getCourseName(),
                        request.getProgramType())
                .orElseThrow(() -> new RuntimeException("ProgramType not found for this course"));

        Batch batch = batchRepository.findById(request.getBatchId())
                .orElseThrow(() -> new RuntimeException("Batch not found"));

        String existingId = student.getId();

        mapper.map(request, student);

        student.setId(existingId);
        student.setCourse(course);
        student.setBatch(batch);

        return studentRepository.save(student);
    }

    @Override
    public boolean deleteStudentById(String id) {
        if (!studentRepository.existsById(id))
            return false;

        studentRepository.deleteById(id);
        return true;
    }

    @Override
    public Page<Student> getAllStudents(int page, int size) {
        return studentRepository.findAll(PageRequest.of(page - 1, size));
    }

    @Override
    public List<Student> searchByName(String name) {
        return studentRepository.findByStudentNameContainingIgnoreCase(name);
    }
}