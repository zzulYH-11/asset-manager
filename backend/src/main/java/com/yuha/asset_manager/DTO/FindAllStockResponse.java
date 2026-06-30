package com.yuha.asset_manager.DTO;

import java.util.ArrayList;
import java.util.List;

public class FindAllStockResponse {
    public List<StockDTO> stockList;

    public FindAllStockResponse() {
        stockList = new ArrayList<>();
    }
}
