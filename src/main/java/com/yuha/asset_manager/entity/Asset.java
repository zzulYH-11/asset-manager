package com.yuha.asset_manager.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "stocks")
@Getter @Setter
@NoArgsConstructor
public class Asset {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long stockId;

    private String ticker;
    //private String stockName;
    private int price;
    private int quantity;

    public int getTotalPrice() {
        return this.price * this.quantity;
    }
}
