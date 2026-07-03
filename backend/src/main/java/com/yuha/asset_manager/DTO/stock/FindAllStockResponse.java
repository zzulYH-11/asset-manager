package com.yuha.asset_manager.DTO.stock;

import java.util.ArrayList;
import java.util.List;

public class FindAllStockResponse {
    public List<StockDTO> stockList;

    public FindAllStockResponse() {
        stockList = new ArrayList<>();
    }
}
