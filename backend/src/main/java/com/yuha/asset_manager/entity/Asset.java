package com.yuha.asset_manager.entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.Date;

@Entity
@Getter
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long assetId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    private Date createTime;
    private double totalPrice;
}
