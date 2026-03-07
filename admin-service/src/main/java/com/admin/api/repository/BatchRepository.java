package com.admin.api.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.admin.api.entity.Batch;

@Repository
public interface BatchRepository extends JpaRepository<Batch, Long> {

    // Staff time conflict
	@Query("""
		    SELECT b FROM Batch b
		    JOIN b.staffs s
		    WHERE s.id IN :staffIds
		    AND (:startDate <= b.endDate AND :endDate >= b.startDate)
		    AND (:startTime < b.endTime AND :endTime > b.startTime)
		""")
		List<Batch> staffTimeConflict(
		    List<Long> staffIds,
		    LocalDate startDate,
		    LocalDate endDate,
		    LocalTime startTime,
		    LocalTime endTime
		);
    // Room time conflict
	@Query("""
		    SELECT b FROM Batch b
		    WHERE b.roomNumber = :room
		    AND (:startDate <= b.endDate AND :endDate >= b.startDate)
		    AND (:startTime < b.endTime AND :endTime > b.startTime)
		""")
		List<Batch> roomTimeConflict(
		    String room,
		    LocalDate startDate,
		    LocalDate endDate,
		    LocalTime startTime,
		    LocalTime endTime
		);
	
	
	
	
	@Query("""
		       SELECT DISTINCT b FROM Batch b
		       JOIN FETCH b.staffs s
		       WHERE :today BETWEEN b.startDate AND b.endDate
		       AND :now BETWEEN b.startTime AND b.endTime
		       """)
		List<Batch> findTodayRunningBatches(LocalDate today, LocalTime now);
	
	@Query("""
		       SELECT b FROM Batch b
		       WHERE :date BETWEEN b.startDate AND b.endDate
		       """)
		List<Batch> findRunningBatchesByDate(LocalDate date);
}
