package com.yuha.asset_manager.DTO.stock;

import com.yuha.asset_manager.entity.Stock;

public record StockDTO (
        Long stockId,
        String ticker,
        int quantity,
        double price,
        double totalValuation
)
{
    public static StockDTO from(Stock stock) {
        return new StockDTO(
                stock.getStockId(),
                stock.getTicker(),
                stock.getQuantity(),
                stock.getPurchasePrice(),
                stock.getQuantity() * stock.getPurchasePrice()
        );
    }
}
