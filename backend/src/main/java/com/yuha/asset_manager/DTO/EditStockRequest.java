package com.yuha.asset_manager.DTO;


import jakarta.validation.constraints.Min;

public record EditStockRequest (
        @Min(1)
        int quantity,

        @Min(1)
        double price
) {

}
