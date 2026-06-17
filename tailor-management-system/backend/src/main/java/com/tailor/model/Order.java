package com.tailor.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "order_number", unique = true, nullable = false, length = 50)
    private String orderNumber;

    @Column(name = "dress_type", nullable = false, length = 100)
    private String dressType;

    @Column(nullable = false, length = 50)
    private String status = "PENDING"; // 'PENDING', 'CUTTING', 'STITCHING', 'READY', 'DELIVERED'

    @Column(nullable = false, length = 20)
    private String priority = "ON_SCHEDULE"; // 'URGENT', 'NEAR_DEADLINE', 'ON_SCHEDULE'

    @Column(name = "delivery_date", nullable = false)
    private LocalDate deliveryDate;

    @Column(name = "assigned_tailor", length = 100)
    private String assignedTailor;

    @Column(name = "payment_status", length = 20)
    private String paymentStatus = "PENDING"; // 'PENDING', 'PARTIAL', 'PAID'

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
