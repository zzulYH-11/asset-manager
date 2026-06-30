package com.yuha.asset_manager.common;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    // common
    INVALID_INPUT(HttpStatus.BAD_REQUEST, "C001", "입력값이 올바르지 않습니다."),
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "C002", "허용되지 않은 메서드입니다."),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "C003", "서버 내부 오류가 발생했습니다."),

    // stock
    STOCK_NOT_FOUND(HttpStatus.NOT_FOUND, "S001", "주식을 찾을 수 없습니다."),
    STOCK_ALREADY_EXIST(HttpStatus.CONFLICT, "S002", "이미 존재하는 주식입니다."),

    // asset

    // member
    MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "M001", "사용자를 찾을 수 없습니다."),
    MEMBER_ALREADY_EXIST(HttpStatus.CONFLICT, "M002", "이미 존재하는 사용자입니다.");

    // field
    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    // constructor
    ErrorCode(HttpStatus httpStatus, String code, String message) {
        this.httpStatus = httpStatus;
        this.code = code;
        this.message = message;
    }
}
