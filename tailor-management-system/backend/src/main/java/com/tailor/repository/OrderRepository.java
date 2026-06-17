package com.tailor.repository;

import com.tailor.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findByStatus(String status);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status != 'DELIVERED'")
    long countActiveOrders();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = 'READY'")
    long countPendingDeliveries();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = 'DELIVERED'")
    long countCompletedOrders();

    @Query("SELECT o FROM Order o WHERE o.deliveryDate = :today AND o.status != 'DELIVERED'")
    List<Order> findTodaysSchedule(@Param("today") LocalDate today);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = 'DELIVERED'")
    Double calculateTotalRevenue();
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.customer.id = :customerId")
    long countByCustomerId(@Param("customerId") Long customerId);
}
