package com.tailor.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "invoice_number", unique = true, nullable = false, length = 50)
    private String invoiceNumber;

    @Column(name = "gst_amount", nullable = false)
    private Double gstAmount;

    @Column(name = "discount_amount")
    private Double discountAmount = 0.0;

    @Column(nullable = false)
    private Double subtotal;

    @Column(name = "grand_total", nullable = false)
    private Double grandTotal;

    @Column(name = "payment_status", nullable = false, length = 20)
    private String paymentStatus; // 'PAID', 'UNPAID'

    @Column(name = "payment_method", length = 50)
    private String paymentMethod; // 'CASH', 'CARD', 'UPI'

    @Column(name = "qr_payload", length = 255)
    private String qrPayload;

    @Column(name = "generated_at", updatable = false)
    private LocalDateTime generatedAt = LocalDateTime.now();
}
