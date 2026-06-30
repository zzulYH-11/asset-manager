package com.yuha.asset_manager.common.DTO;

import com.yuha.asset_manager.common.ErrorCode;
import lombok.Getter;

@Getter
public class ErrorResponse {
    private final String code;
    private final String message;

    public ErrorResponse(ErrorCode errorCode) {
        this.code = errorCode.getCode();
        this.message = errorCode.getMessage();
    }
}