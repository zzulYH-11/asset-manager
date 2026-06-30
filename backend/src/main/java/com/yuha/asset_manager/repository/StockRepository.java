package com.yuha.asset_manager.repository;

import com.yuha.asset_manager.entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {

    Stock findByTicker(String ticker);

    List<Stock> findByMemberMemberId(Long memberId);

    Stock findByMemberMemberIdAndTicker(Long memberId, String ticker);
    Stock findByMemberMemberIdAndStockId(Long memberId, Long StockId);
}