# Architecture

## 시스템 아키텍처

```text
                 +---------------------+
                 |      Browser        |
                 +----------+----------+
                            |
                            |
                      HTTPS Request
                            |
                            v
                 +---------------------+
                 |   Frontend (React)  |
                 |       Vercel        |
                 +----------+----------+
                            |
                     REST API (HTTPS)
                            |
                            v
                 +---------------------+
                 | Spring Boot Backend |
                 |       Railway       |
                 +----------+----------+
                            |
                            |
                      JPA / Hibernate (JDBC)
                            |
                            v
                 +---------------------+
                 |      Database       |
                 |      Railway MySQL  |
                 +---------------------+
```

---

# 기술 스택

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React (v19) + Vite (v8) / Chart.js / Font Awesome 6 |
| **Backend** | Spring Boot 3.5.11 (Java 17) |
| **Database** | MySQL |
| **Deployment** | Vercel (Frontend), Railway (Backend & DB) |
| **Version Control**| Git + GitHub |
| **CI/CD** | GitHub Actions (빌드 검증) & Platform Auto-Deploy (CD) |

---

# 프로젝트 구조

```text
project/
│
├── frontend/             # React + Vite 웹 애플리케이션
│   ├── src/
│   │   ├── assets/       # 로고 및 정적 리소스
│   │   ├── components/   # 재사용 가능한 UI 컴포넌트
│   │   ├── App.jsx       # 메인 레이아웃 및 탭 브라우징 제어
│   │   └── index.css     # 전역 스타일 및 디자인 토큰
│   └── vercel.json       # Vercel SPA 라우트 재작성 규칙
│
├── backend/              # Spring Boot 백엔드 애플리케이션
│   ├── src/main/java/com/yuha/asset_manager/
│   │   ├── controller/   # API 엔드포인트
│   │   ├── service/      # 비즈니스 로직
│   │   ├── repository/   # DB 레포지토리 (JPA)
│   │   ├── entity/       # DB 테이블 매핑 엔티티
│   │   ├── DTO/          # 데이터 전송용 Java Record
│   │   └── common/       # 공통 응답 및 전역 예외 처리
│   └── build.gradle
│
└── docs/                 # 설계, 아키텍처, 회의 기록 마크다운 문서
```

---

# Backend Architecture (패키지 구조)

```text
backend/src/main/java/com/yuha/asset_manager/
│
├── controller/
│   ├── StockController.java     # 주식 자산 CRUD API 제어
│   ├── NewsController.java      # 경제 뉴스 API 제어
│   └── IndicatorController.java  # 글로벌 경제 지표 API 제어
│
├── service/
│   └── StockService.java        # 가중평균단가 계산 및 자산 CRUD 비즈니스 로직
│
├── repository/
│   └── StockRepository.java     # Stock 엔티티에 접근하는 Spring Data JPA 인터페이스
│
├── entity/
│   └── Stock.java               # stock_id, ticker, quantity, purchasePrice, memberId 매핑
│
├── DTO/
│   ├── StockDTO.java            # 단일 주식 응답 데이터 Record
│   ├── AddStockRequest.java     # 신규 등록 요청 바인딩 DTO
│   └── FindAllStockResponse.java# 전체 보유 자산 목록 응답용 DTO
│
└── common/
    └── DTO/
        └── ApiResponse.java     # success, data, error 구조를 포장하는 공통 Wrapper DTO
```

---

# Frontend Architecture (구조 및 라우팅)

* **SPA Single Page 구조**: `App.jsx` 단일 파일 내에서 `activeTab` 상태('portfolio', 'news', 'indicators')에 따라 하위 컴포넌트나 섹션이 동적으로 마운트되는 구조를 가집니다.
* **디자인 시스템**: `index.css`에 `--primary`, `--bg-card` 등 다크/라이트 테마별 CSS 변수(Variable)를 정의해 두고 클래스 토글만으로 디자인 토큰이 전환되는 **글래스모피즘(Glassmorphism)** 다크 모드를 완성했습니다.
* **데이터 시각화**: `react-chartjs-2` 라이브러리를 바인딩하여 백엔드로부터 넘겨받은 `stockList` 자산 비중을 실시간으로 도넛 차트에 그립니다.

---

# API Architecture (통신 아키텍처)

```text
Browser (React) ──► Fetch API ──► Spring Controller ──► Service ──► Repository ──► Database (MySQL)
```
* **Fetch API**: 리액트 내장 `fetch` 모듈을 이용하여 백엔드의 REST API 엔드포인트 `/api/stocks`, `/api/news`, `/api/indicators`로 HTTP 비동기 요청을 수행합니다.
* **CORS 설정**: 백엔드 컨트롤러에 `@CrossOrigin` 또는 글로벌 `WebMvcConfigurer` 설정을 추가하여 프런트엔드 도메인(`https://*.vercel.app`)으로부터의 자원 공유를 개방했습니다.

---

# Authentication & Authorization (인증 및 인가)

* **MVP v1 한계**: 인증 모듈(Spring Security, JWT) 구현 리소스를 배포 우선순위에서 배제(제외)했습니다.
* **사용자 격리**: HTTP Request Header에 **`X-Member-Id`**라는 임시 정수 식별자를 헤더로 전송합니다. 백엔드는 이 헤더의 값을 감지하여 해당 회원 소유의 자산 데이터만 격리 조회 및 생성/삭제를 수행합니다.

---

# Database (ERD & Schema)

### ERD 개요
```text
[Stock Table]
- stock_id (PK) : Long (Auto Increment)
- ticker : String (종목코드, 예: AAPL)
- quantity : Integer (보유 수량)
- purchase_price : Double (평균 매입 단가)
- member_id : Long (사용자 식별 번호)
```

---

# Deployment (배포 환경)

## Frontend
* **Platform**: Vercel
* **Build Target**: Vite Production Build (`/dist` 폴더 산출물 서비스)
* **Domain**: `https://asset-manager-tau-ten.vercel.app`

## Backend
* **Platform**: Railway
* **Build Target**: Gradle build executable JAR file (`asset-manager-0.0.1-SNAPSHOT.jar` 기동)
* **Domain**: `https://asset-manager-production-6f83.up.railway.app`

## Database
* **Platform**: Railway MySQL Service
* **Connection**: 백엔드 컨테이너와 동일 프로젝트 내부망(Private Network) 환경 변수 바인딩을 통해 내부 전용 포트(`3306`)로 다이렉트 통신.

---

# CI/CD (배포 파이프라인)

```text
Developer ──► Git Push ──► GitHub ──► (GitHub Actions 빌드 검사)
                                         │
                                         ├───► Auto-Deploy to Vercel (Front)
                                         └───► Auto-Deploy to Railway (Back)
```
* **지속적 통합(CI)**: GitHub Actions을 이용하여 PR 또는 main 브랜치 푸시 시 백엔드 테스트 및 빌드 무결성을 사전에 체크합니다.
* **지속적 배포(CD)**: Vercel과 Railway의 GitHub Webhook 연동을 통해 빌드 성공 시 실제 상용 서버에 무중단으로 반영됩니다.

---

# Environment Variables (환경 변수)

## Frontend
```env
# 백엔드 서버의 루트 호스트 주소 지정
VITE_API_URL=https://asset-manager-production-6f83.up.railway.app
```

## Backend
```env
# Railway MySQL 서비스 자동 연동 변수
MYSQLHOST=${{MySQL.MYSQLHOST}}
MYSQLPORT=${{MySQL.MYSQLPORT}}
MYSQLDATABASE=${{MySQL.MYSQLDATABASE}}
MYSQLUSER=${{MySQL.MYSQLUSER}}
MYSQLPASSWORD=${{MySQL.MYSQLPASSWORD}}

# Railway 구동 포트 변수
PORT=${{PORT}}
```

---

# 향후 아키텍처 확장 계획

* **Spring Security & JWT 인증**: 로그인 및 리프레시 토큰 발급 프로세스를 추가하여 안전한 세션 관리 구축.
* **실시간 외부 금융 정보 스크래퍼/배치**: Yahoo Finance 등 외부 API를 백엔드 스케줄러(Spring Batch / Cron)와 연동하여 보유 주식의 현재가 실시간 동기화 구현.
* **포트폴리오 이력 보존용 스냅샷 테이블**: 자산 변화 추이 그래프 구현을 위해 일별/월별 자산 총액을 배치 프로그램이 기록하는 `portfolio_snapshot` 테이블 추가 설계.