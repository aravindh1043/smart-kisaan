package com.smartkisaan.api.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "market_prices")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarketPrice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String district;

    @Column(nullable = false)
    private String mandiName;

    @Column(nullable = false)
    private String crop;

    private String variety;
    private String grade;

    @Column(nullable = false)
    private LocalDate arrivalDate;

    private BigDecimal arrivalVolumeQuintals;

    @Column(nullable = false)
    private BigDecimal minPrice;

    @Column(nullable = false)
    private BigDecimal maxPrice;

    @Column(nullable = false)
    private BigDecimal modalPrice;

    private BigDecimal mspPrice;

    private BigDecimal previousModalPrice;

    @Enumerated(EnumType.STRING)
    private PriceTrend trend;

    private String dataSource;

    public enum PriceTrend {
        UP, DOWN, STABLE
    }
}
