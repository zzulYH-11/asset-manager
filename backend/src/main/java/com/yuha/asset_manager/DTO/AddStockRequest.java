package com.yuha.asset_manager.DTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record AddStockRequest (

        @NotNull
        String ticker,

        @Min(1)
        int quantity,

        @Min(1)
        double price
)
{
}
