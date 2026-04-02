package com.yuha.asset_manager.repository;

import com.yuha.asset_manager.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
    // 기본적으로 findAll(), save() 등을 제공합니다.

    public Asset findByTicker(String ticker);
}