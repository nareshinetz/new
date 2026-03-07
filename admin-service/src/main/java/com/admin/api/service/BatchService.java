package com.admin.api.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.admin.api.entity.Batch;
import com.admin.api.entity.Student;
import com.admin.api.model.BatchRequest;

import jakarta.validation.Valid;

public interface BatchService {
   	Batch createBatch(@Valid BatchRequest batchRequest);

	Optional<Batch> getBatchById(Long id);

	List<Batch> getAllBatch();

	Batch updateBatchById(Long id, BatchRequest batchRequest);

	boolean deleteBatchById(Long id); 
	
	   // ✅ NEW METHOD
    List<Student> getStudentsByBatchId(Long batchId);
    
    List<Batch> getRunningBatchesByDate(LocalDate date);
    



}
