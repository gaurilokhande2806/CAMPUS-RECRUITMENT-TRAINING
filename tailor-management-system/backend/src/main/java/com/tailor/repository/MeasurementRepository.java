package com.tailor.repository;

import com.tailor.model.Measurement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MeasurementRepository extends JpaRepository<Measurement, Long> {
    List<Measurement> findByCustomerIdOrderByVersionNumDesc(Long customerId);
    
    // Find the latest version of a customer's measurement
    Optional<Measurement> findFirstByCustomerIdOrderByVersionNumDesc(Long customerId);
}
