package com.tailor.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "measurements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Measurement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    private Double chest;
    private Double shoulder;
    private Double sleeve;
    private Double neck;
    private Double waist;
    private Double hip;

    @Column(name = "pant_length")
    private Double pantLength;

    private Double inseam;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "version_num")
    private Integer versionNum = 1;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
