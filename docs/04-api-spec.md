<!--
# [이전 버전] API Specification (v2 이상 반영용)

## 1. 공통 정의
### Base URL
* Local 환경: http://localhost:8080/api
* Production 환경: ${VITE_API_URL}/api

### 공통 응답 포맷 (Common Response Format)
#### 성공 응답 (Success)
* HTTP Status: 200 OK (또는 201 Created)
```json
{
  "success": true,
  "data": {
    // 실제 반환 데이터 객체 또는 배열
  },
  "error": null
}
```
#### 실패 응답 (Error)
* HTTP Status: 4xx 또는 5xx
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERR_INVALID_INPUT",
    "message": "요청 인자가 유효하지 않습니다."
  }
}
```

## 2. 인증 API (Authentication)
### 2.1 회원가입 (Sign Up)
* Method & URL: POST /auth/signup
* Auth: 필요 없음
* Request Body: {"email": "user@example.com", "password": "Password123!", "nickname": "자산전문가"}
* Response (201 Created): {"success": true, "data": {"memberId": 1, "email": "user@example.com", "nickname": "자산전문가", "createdAt": "2026-06-30T10:30:00.000Z"}, "error": null}

### 2.2 로그인 (Login)
* Method & URL: POST /auth/login
* Auth: 필요 없음
* Request Body: {"email": "user@example.com", "password": "Password123!"}
* Response (200 OK): {"success": true, "data": {"tokenType": "Bearer", "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", "expiresIn": 86400, "nickname": "자산전문가"}, "error": null}

## 3. 자산 관리 API (Assets)
* Authorization: Bearer <accessToken>
* 3.1 보유 자산 목록 조회: GET /assets
* 3.2 새 자산 등록: POST /assets
* 3.3 자산 정보 수정: PUT /assets/{id}
* 3.4 자산 삭제: DELETE /assets/{id}

## 4. 시장 정보 API (Market Info)
* 4.1 경제 뉴스 조회: GET /news
* 4.2 글로벌 시장 지표 조회: GET /indicators
-->

# API Specification (MVP v1) - Postman Test Guide

이 문서는 `docs/02-mvp.md`에 맞춤화된 **MVP v1 API 명세**입니다. 
로그인 및 회원가입은 제외되었으며, 사용자 식별을 위해 헤더에 `X-Member-Id`를 추가하여 통신합니다. 
주식 수량(`quantity`)은 모두 **정수(Integer)** 타입으로 처리됩니다.

---

## 1. 공통 정의 (Common Config)

* **Base URL**: `http://localhost:8080/api`
* **Common Request Header** (모든 API 요청 시 필수):
  * `Content-Type: application/json`
  * `X-Member-Id: 1` (사용자 식별용 회원 ID, 정수형)

---

## 2. 미국 주식 관리 API (Stocks CRUD)

### 2.1 보유 주식 목록 조회
* **Method & URL**: `GET http://localhost:8080/api/stocks`
* **Headers**: 
  * `Accept: application/json`
  * `X-Member-Id: 1`
* **Response 예시 (200 OK)**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "ticker": "AAPL",
        "price": 175.50,
        "quantity": 10,
        "totalValuation": 1755.00
      },
      {
        "id": 2,
        "ticker": "TSLA",
        "price": 220.40,
        "quantity": 15,
        "totalValuation": 3306.00
      }
    ],
    "error": null
  }
  ```

### 2.2 미국 주식 신규 등록
* **Method & URL**: `POST http://localhost:8080/api/stocks`
* **Headers**: 
  * `Content-Type: application/json`
  * `X-Member-Id: 1`
* **Request Body (raw JSON)**
  ```json
  {
    "ticker": "NVDA",
    "price": 485.20,
    "quantity": 8
  }
  ```
* **Response 예시 (201 Created)**
  ```json
  {
    "success": true,
    "data": {
      "id": 3,
      "ticker": "NVDA",
      "price": 485.20,
      "quantity": 8,
      "totalValuation": 3881.60
    },
    "error": null
  }
  ```
* **에러 Response 예시 (400 Bad Request - 유효성 실패)**
  * 단가가 음수이거나 수량이 정수가 아닌 경우 또는 음수인 경우
  ```json
  {
    "success": false,
    "data": null,
    "error": {
      "code": "ERR_INVALID_INPUT",
      "message": "매입 단가는 0보다 커야 하며, 보유 수량은 양의 정수여야 합니다."
    }
  }
  ```

### 2.3 미국 주식 정보 수정
* **Method & URL**: `PUT http://localhost:8080/api/stocks/3`
  * (URL의 `3`은 수정 대상 자산의 고유 `id` 값입니다.)
* **Headers**: 
  * `Content-Type: application/json`
  * `X-Member-Id: 1`
* **Request Body (raw JSON)**
  ```json
  {
    "price": 490.00,
    "quantity": 10
  }
  ```
* **Response 예시 (200 OK)**
  ```json
  {
    "success": true,
    "data": {
      "id": 3,
      "ticker": "NVDA",
      "price": 490.00,
      "quantity": 10,
      "totalValuation": 4900.00
    },
    "error": null
  }
  ```
* **에러 Response 예시 (404 Not Found - 자산 없음)**
  * 존재하지 않는 ID로 수정을 시도한 경우
  ```json
  {
    "success": false,
    "data": null,
    "error": {
      "code": "ERR_RESOURCE_NOT_FOUND",
      "message": "수정하려는 ID(3)의 자산 정보를 찾을 수 없습니다."
    }
  }
  ```

### 2.4 미국 주식 삭제
* **Method & URL**: `DELETE http://localhost:8080/api/stocks/3`
  * (URL의 `3`은 삭제 대상 자산의 고유 `id` 값입니다.)
* **Headers**: 
  * `Accept: application/json`
  * `X-Member-Id: 1`
* **Response 예시 (200 OK)**
  ```json
  {
    "success": true,
    "data": {
      "deletedAssetId": 3
    },
    "error": null
  }
  ```
* **에러 Response 예시 (404 Not Found - 자산 없음)**
  ```json
  {
    "success": false,
    "data": null,
    "error": {
      "code": "ERR_RESOURCE_NOT_FOUND",
      "message": "삭제하려는 ID(3)의 자산 정보를 찾을 수 없습니다."
    }
  }
  ```

---

## 3. 거시경제 정보 API (Macroeconomics Info)

### 3.1 주요 경제 뉴스 10개 조회
* **Method & URL**: `GET http://localhost:8080/api/news`
* **Headers**: 
  * `Accept: application/json`
  * `X-Member-Id: 1`
* **Response 예시 (200 OK)**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "source": "Reuters",
        "time": "10분 전",
        "title": "미국 연준, 기준금리 동결 결정... 연내 인하 기조 유지",
        "summary": "연방공개시장위원회(FOMC)는 정례회의에서 기준금리를 현행 수준으로 동결하고 연내 3회 인하 전망을 유지했습니다."
      },
      {
        "id": 2,
        "source": "Bloomberg",
        "time": "30분 전",
        "title": "엔비디아 차세대 블랙웰 칩 공개, 주가 4% 급등하며 사상 최고치",
        "summary": "엔비디아가 기존 칩 대비 연산 효율이 30배 높은 차세대 Blackwell GPU 칩을 선보였습니다."
      },
      {
        "id": 3,
        "source": "CoinDesk",
        "time": "2시간 전",
        "title": "비트코인 현물 ETF 유입세 급증, 7만 달러 안착 시도",
        "summary": "블랙록 등 주요 자산운용사의 현물 ETF로 신규 유입 자금이 늘면서 가상자산 시장이 상승세를 나타내고 있습니다."
      },
      {
        "id": 4,
        "source": "WSJ",
        "time": "3시간 전",
        "title": "미국 5월 소비자물가지수(CPI) 전년 대비 3.3% 상승... 예상치 하회",
        "summary": "미 노동부가 발표한 5월 CPI 상승률이 연준의 긴축 완화 시점을 당길 수 있다는 기대감에 증시는 랠리했습니다."
      },
      {
        "id": 5,
        "source": "Financial Times",
        "time": "4시간 전",
        "title": "유럽중앙은행(ECB), 주요국 중 최초로 기준금리 0.25%p 인하 단행",
        "summary": "ECB는 유로존 인플레이션 둔화 압력에 따라 기준금리를 기존 4.5%에서 4.25%로 전격 인하했습니다."
      },
      {
        "id": 6,
        "source": "CNBC",
        "time": "5시간 전",
        "title": "소비자 신뢰지수 3개월 연속 하락... 미국 소비 심리 악화 조짐",
        "summary": "고금리 장기화와 고용 둔화에 대한 우려로 미국 경제의 버팀목인 소비 활력이 약화되고 있습니다."
      },
      {
        "id": 7,
        "source": "MarketWatch",
        "time": "6시간 전",
        "title": "미국 10년물 국채금리 4.2%선 하회... CPI 둔화 여파 지속",
        "summary": "시장 금리의 지표가 되는 10년물 국채금리가 인플레이션 하락 신호에 민감하게 반응하여 급락세를 이어갔습니다."
      },
      {
        "id": 8,
        "source": "Reuters",
        "time": "7시간 전",
        "title": "WTI 국제유가 배럴당 80달러선 붕괴... 글로벌 경기 둔화 우려 반영",
        "summary": "중국 등 주요국 경제 지표 부진과 OPEC+의 점진적 감산 완화 계획 발표로 인해 공급 과잉 우려가 부각되었습니다."
      },
      {
        "id": 9,
        "source": "Bloomberg",
        "time": "8시간 전",
        "title": "미국 2분기 GDP 성장률 잠정치 2.1% 기록... 연착륙 시나리오 기대",
        "summary": "소비 강세가 이어지며 급격한 경기 침체 없이 물가가 안정되는 골디락스 경제 전망이 힘을 얻고 있습니다."
      },
      {
        "id": 10,
        "source": "Nikkei",
        "time": "12시간 전",
        "title": "일본 엔화 가치, 달러당 160엔선 위협... 엔화 초약세에 시장 개입 긴장감",
        "summary": "미일 간 금리 차 확대로 엔-달러 환율이 사상 최저 수준으로 하락하면서 통화 당국의 구두 개입이 잇따르고 있습니다."
      }
    ],
    "error": null
  }
  ```

### 3.2 글로벌 시장 지수 9종 조회
* **Method & URL**: `GET http://localhost:8080/api/indicators`
* **Headers**: 
  * `Accept: application/json`
  * `X-Member-Id: 1`
* **Response 예시 (200 OK)**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "미국 10년물 국채금리",
        "value": "4.21%",
        "change": "+0.03%",
        "isUp": true,
        "code": "US10Y"
      },
      {
        "id": 2,
        "name": "달러 인덱스",
        "value": "104.15",
        "change": "-0.12",
        "isUp": false,
        "code": "DXY"
      },
      {
        "id": 3,
        "name": "원-달러 환율",
        "value": "1,342.20원",
        "change": "+2.50원",
        "isUp": true,
        "code": "USDKRW"
      },
      {
        "id": 4,
        "name": "공포지수 (VIX)",
        "value": "13.82",
        "change": "-0.45",
        "isUp": false,
        "code": "VIX"
      },
      {
        "id": 5,
        "name": "WTI 원유 ($/배럴)",
        "value": "81.35",
        "change": "+0.65",
        "isUp": true,
        "code": "WTI"
      },
      {
        "id": 6,
        "name": "금 ($/온스)",
        "value": "2,178.60",
        "change": "+11.30",
        "isUp": true,
        "code": "GOLD"
      },
      {
        "id": 7,
        "name": "비트코인 ($)",
        "value": "68,450",
        "change": "+1,890",
        "isUp": true,
        "code": "BTC"
      },
      {
        "id": 8,
        "name": "S&P 500",
        "value": "5,241.53",
        "change": "+45.10",
        "isUp": true,
        "code": "SPX"
      },
      {
        "id": 9,
        "name": "나스닥 지수",
        "value": "16,429.11",
        "change": "+201.20",
        "isUp": true,
        "code": "IXIC"
      }
    ],
    "error": null
  }
  ```

---

## 4. MVP 공통 에러 코드 (Error Codes)

| HTTP Status | Error Code | Description |
| :--- | :--- | :--- |
| `400 Bad Request` | `ERR_INVALID_INPUT` | 요청 파라미터 유효성 검증 실패 (단가/수량 누락 혹은 음수 입력 등) |
| `404 Not Found`   | `ERR_RESOURCE_NOT_FOUND` | 요청 대상 리소스(지정한 ID의 주식 자산 등)를 찾을 수 없음 |
| `500 Server Error`| `ERR_INTERNAL_SERVER` | 서버 내부 로직 처리 실패 혹은 외부 크롤링/지표 API 수신 에러 |
