package com.yuha.asset_manager.common.Exception;

import com.yuha.asset_manager.common.ErrorCode;
import lombok.Getter;

@Getter
public class NotFoundException extends RuntimeException {

    private final ErrorCode errorCode;

    public NotFoundException(ErrorCode errorcode) {
        super(errorcode.getMessage());
        this.errorCode = errorcode;
    }
}
