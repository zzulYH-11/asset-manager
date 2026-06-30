package com.yuha.asset_manager.common;

import com.yuha.asset_manager.common.DTO.ApiResponse;
import com.yuha.asset_manager.common.DTO.ErrorResponse;
import com.yuha.asset_manager.common.Exception.NotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import static com.yuha.asset_manager.common.ErrorCode.INVALID_INPUT;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Common
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> NotFoundException(NotFoundException e) {

        return ResponseEntity.status(e.getErrorCode().getHttpStatus())
                .body(ApiResponse.error(new ErrorResponse(e.getErrorCode())));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> MethodArgumentNotValidException(MethodArgumentNotValidException e) {

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(new ErrorResponse(INVALID_INPUT)));
    }

    // Member


    // Stock


    // Asset

    // Unexpected
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleUnknownException(Exception e) {

        // 로깅
        log.error("Unexpected error", e);
        ErrorCode errorCode = ErrorCode.INTERNAL_SERVER_ERROR;
        return ResponseEntity.status(errorCode.getHttpStatus())
                .body(ApiResponse.error(new ErrorResponse(errorCode)));
    }
}
