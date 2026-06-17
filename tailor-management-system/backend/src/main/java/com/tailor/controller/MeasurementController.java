package com.tailor.controller;

import com.tailor.model.Customer;
import com.tailor.model.Measurement;
import com.tailor.repository.CustomerRepository;
import com.tailor.repository.MeasurementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/measurements")
@CrossOrigin(origins = "*")
public class MeasurementController {

    @Autowired
    private MeasurementRepository measurementRepository;

    @Autowired
    private CustomerRepository customerRepository;

    // Get all versions of measurements for a customer
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Measurement>> getCustomerMeasurements(@PathVariable Long customerId) {
        return ResponseEntity.ok(measurementRepository.findByCustomerIdOrderByVersionNumDesc(customerId));
    }

    // Get the latest measurement version for a customer
    @GetMapping("/customer/{customerId}/latest")
    public ResponseEntity<Measurement> getLatestCustomerMeasurement(@PathVariable Long customerId) {
        Optional<Measurement> measurement = measurementRepository.findFirstByCustomerIdOrderByVersionNumDesc(customerId);
        return measurement.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create a new measurement version
    @PostMapping
    public ResponseEntity<?> saveMeasurement(@RequestBody Measurement measurement) {
        if (measurement.getCustomer() == null || measurement.getCustomer().getId() == null) {
            return ResponseEntity.badRequest().body("Customer ID is required.");
        }

        Long customerId = measurement.getCustomer().getId();
        Optional<Customer> customerOpt = customerRepository.findById(customerId);
        if (!customerOpt.isEmpty()) {
            measurement.setCustomer(customerOpt.get());
            
            // Query latest version to increment
            Optional<Measurement> latestOpt = measurementRepository.findFirstByCustomerIdOrderByVersionNumDesc(customerId);
            if (latestOpt.isPresent()) {
                measurement.setVersionNum(latestOpt.get().getVersionNum() + 1);
            } else {
                measurement.setVersionNum(1);
            }
            
            Measurement saved = measurementRepository.save(measurement);
            return ResponseEntity.ok(saved);
        }
        return ResponseEntity.notFound().build();
    }
}
