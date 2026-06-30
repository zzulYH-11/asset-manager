package com.yuha.asset_manager.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long stockId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    private String ticker;
    private double purchasePrice;
    private int quantity;

    public double getTotalPrice() {
        return this.purchasePrice * this.quantity;
    }
}


