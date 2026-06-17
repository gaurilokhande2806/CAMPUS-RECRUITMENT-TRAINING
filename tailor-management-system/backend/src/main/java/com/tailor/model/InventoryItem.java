package com.tailor.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fabric_name", nullable = false, length = 150)
    private String fabricName;

    @Column(nullable = false, length = 50)
    private String category; // 'Wool', 'Silk', 'Linen', 'Cotton', 'Velvet'

    @Column(name = "available_qty", nullable = false)
    private Double availableQty;

    @Column(name = "unit_price", nullable = false)
    private Double unitPrice;

    @Column(nullable = false, length = 100)
    private String supplier;

    @Column(nullable = false, length = 20)
    private String status = "IN_STOCK"; // 'IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'

    @Column(name = "min_alert_qty")
    private Double minAlertQty = 10.0;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    @PrePersist
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        if (availableQty <= 0) {
            status = "OUT_OF_STOCK";
        } else if (availableQty <= minAlertQty) {
            status = "LOW_STOCK";
        } else {
            status = "IN_STOCK";
        }
    }
}
