package com.tailor.repository;

import com.tailor.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
    @Query("SELECT c FROM Customer c WHERE c.name LIKE %:query% OR c.phone LIKE %:query% OR c.email LIKE %:query%")
    List<Customer> searchCustomers(@Param("query") String query);

    @Query("SELECT COUNT(c) FROM Customer c WHERE c.status = 'ACTIVE'")
    long countActiveCustomers();
}
