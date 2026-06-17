package com.tailor.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InventoryLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "item_id", nullable = false)
    private InventoryItem inventoryItem;

    @Column(name = "change_qty", nullable = false)
    private Double changeQty;

    @Column(name = "log_type", nullable = false, length = 20)
    private String logType; // 'CONSUMPTION', 'RESTOCK'

    @Column(length = 255)
    private String remarks;

    @Column(name = "logged_at", updatable = false)
    private LocalDateTime loggedAt = LocalDateTime.now();
}
