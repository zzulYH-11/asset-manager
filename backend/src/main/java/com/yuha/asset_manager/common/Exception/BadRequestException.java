package com.yuha.asset_manager.common.Exception;

import com.yuha.asset_manager.common.ErrorCode;

public class BadRequestException extends RuntimeException {

    private final ErrorCode errorCode;

    public BadRequestException(ErrorCode errorcode) {
        super(errorcode.getMessage());
        this.errorCode = errorcode;
    }
}
