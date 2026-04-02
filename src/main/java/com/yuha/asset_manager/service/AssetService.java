package com.yuha.asset_manager.service;

import com.yuha.asset_manager.entity.Asset;
import com.yuha.asset_manager.repository.AssetRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AssetService {

    final AssetRepository assetRepository;

    public void saveAsset(Asset asset) {
        Asset existingAsset = assetRepository.findByTicker(asset.getTicker());
        if(existingAsset != null){
            throw new RuntimeException("이미 존재하는 자산입니다. : " + asset.getTicker());
        }
        assetRepository.save(asset);
    }

    public void updateQuantity(long id, int quantity) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 자산을 찾을 수 없습니다. id=" + id));
        asset.setQuantity(quantity);
        assetRepository.save(asset);
    }

    public List findAllAsset() {

        return assetRepository.findAll();
    }

    public void deleteAsset(long id) {

        assetRepository.deleteById(id);

    }
}
