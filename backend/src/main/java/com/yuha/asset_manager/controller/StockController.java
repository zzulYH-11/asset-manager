package com.yuha.asset_manager.controller;

import com.yuha.asset_manager.DTO.*;
import com.yuha.asset_manager.common.DTO.ApiResponse;
import com.yuha.asset_manager.service.StockService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/stocks")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @GetMapping
    public ResponseEntity<ApiResponse<FindAllStockResponse>> getAllStocks(@RequestHeader("X-Member-Id") long memberId) {

        return ResponseEntity.ok(ApiResponse.success(stockService.findAllStock(memberId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StockDTO>> addStock (
            @RequestHeader("X-Member-Id") long memberId, @Valid @RequestBody AddStockRequest addStockRequest) {

        StockDTO stockDTO = stockService.addStock(memberId, addStockRequest);

        URI location = URI.create("/api/stocks/" + memberId);

        return ResponseEntity.created(location).body(ApiResponse.success(stockDTO));
    }

    @PutMapping("/{stockId}")
    public ResponseEntity<ApiResponse<StockDTO>> updateStock(
            @RequestHeader("X-Member-Id") long memberId,
            @PathVariable long stockId,
            @Valid @RequestBody EditStockRequest editStockRequest) {

        return ResponseEntity.ok(
                ApiResponse.success(stockService.updateStock(memberId, stockId, editStockRequest)));
    }


    @DeleteMapping("/{stockId}")
    public ResponseEntity<ApiResponse<DeleteStockResponse>> deletePage(
            @RequestHeader("X-Member-Id") long memberId, @PathVariable long stockId) {

        return ResponseEntity.ok(ApiResponse.success(stockService.deleteStock(memberId, stockId)));
    }
}
