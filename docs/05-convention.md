# Convention

본 문서는 **Asset Manager 모노레포 프로젝트**의 원활한 공동 개발과 코드 일관성 유지를 위한 표준 컨벤션 가이드입니다. 

---

## 1. Git Branch Strategy (GitHub-Flow 변형)

모노레포 내 프런트엔드와 백엔드의 유기적인 개발을 위해 가볍고 명확한 브랜치 전략을 취합니다.

* **`main`**: 상용(Production) 배포용 브랜치. 이 브랜치에 코드가 병합되면 Vercel(프런트) 및 Railway(백엔드)로 자동 배포됩니다.
* **`develop`**: 개발용 통합 브랜치. 각 feature 브랜치가 main에 가기 전 모노레포 전체 통합 테스트를 진행하는 곳입니다.
* **`feature/*`**: 신규 기능 개발 또는 아키텍처 추가 작업용 브랜치.
  * 예: `feature/fe-indicator-chart`, `feature/be-validation`
* **`fix/*`**: 기 구현된 기능의 버그 수정 브랜치.
  * 예: `fix/fe-cors-port`, `fix/be-query-error`
* **`docs/*`**: 기획 문서 개편 및 개발 컨벤션 등의 문서 작업 브랜치.
  * 예: `docs/api-update`

---

## 2. Commit Convention

기본적으로 Angular 커밋 컨벤션을 준수하여 직관적인 변경 로그를 유지합니다.

### 커밋 메시지 기본 포맷
```text
<type>(<scope>): <subject>
```

### Type 목록
* **`feat`**: 새로운 기능 추가 (예: `feat(fe): 자산 CRUD 팝업 추가`)
* **`fix`**: 버그 수정 (예: `fix(be): 삭제 기능 시 ID 매핑 오류 수정`)
* **`docs`**: 문서 추가/수정 (예: `docs: 컨벤션 가이드라인 추가`)
* **`style`**: 코드의 의미적 변경 없는 포맷팅 (공백 수정, 세미콜론 누락, Lint 반영 등)
* **`refactor`**: 코드 리팩토링 (기능 추가나 버그 수정이 없는 성능/구조 개선)
* **`test`**: 테스트 코드 추가 및 수정
* **`chore`**: 빌드 도구 변경, 패키지 설정 수정 (`build.gradle`, `package.json` 등)

### 모노레포 Scope 활용 규칙
* 커밋 범위(Scope)에 모노레포 서브 프로젝트명을 명시합니다: **`fe`**, **`be`**, **`docs`**, **`root`**
* 예: `feat(fe): 도넛 차트 컴포넌트 추가` / `fix(be): CORS 허용 패턴 수정`

---

## 3. Pull Request 규칙

* **PR 제목**: 커밋 메시지 규칙과 동일하게 작성하여 작업 영역을 명확히 명시합니다.
  * 예: `[FE] feat: 도넛 차트 비중 툴팁 개선`
* **PR 본문 구성**:
  1. **작업 개요 (What & Why)**: 이번 PR로 해결하고자 하는 내용과 필요성
  2. **핵심 변경 사항 (Key Changes)**: 변경된 핵심 클래스, 파일 혹은 UI 캡처본
  3. **테스트 결과 (Test Results)**: 로컬 혹은 빌드 테스트 통과 스크린샷이나 증적

---

## 4. Backend Convention (Spring Boot)

### 패키지 구조 (계층형 아키텍처)
```text
backend/src/main/java/com/yuha/asset_manager
├── common/        # 공통 예외 처리, 유틸리티, 글로벌 API 응답 정의
├── controller/    # Client 요청 진입점 및 API 라우팅
├── service/       # 비즈니스 로직 비구조화 처리 및 트랜잭션 경계
├── repository/    # JPA 데이터베이스 액세스 레포지토리 인터페이스
├── entity/        # 데이터베이스 테이블과 매핑되는 JPA Entity 객체
└── DTO/           # 요청/응답에 특화된 데이터 구조체
```

### 네이밍 규칙
* **클래스/인터페이스**: PascalCase 사용 (예: `StockController`, `StockService`)
* **메서드/변수**: camelCase 사용 (예: `findAllStock()`, `stockId`)
* **상수**: UPPER_SNAKE_CASE 사용 (예: `MAX_ASSET_LIMIT`)
* **DB 테이블/컬럼**: snake_case 복수형 테이블 권장 (예: `stocks`, `purchase_price`)

### DTO(Data Transfer Object) 규칙
* 클라이언트에 엔티티(`Entity`)를 직접 반환하거나 컨트롤러 파라미터로 직접 수신하지 않습니다.
* 불변성과 메모리 낭비 방지를 위해 Java **`record`** 클래스를 DTO 정의 시 필수 적용합니다.
  * 예: `public record StockDTO(Long stockId, String ticker, int quantity, double price) {}`

### Exception 규칙
* 비즈니스 로직 오류 시 HTTP Status Code만 반환하지 않고, 구체적인 예외 상황을 알릴 수 있도록 커스텀 예외를 활용합니다.
* 전역 예외 처리기(`@RestControllerAdvice`)를 구성하여 모든 오류가 표준화된 에러 JSON 규격으로 반환되도록 합니다.

---

## 5. Frontend Convention (React)

### 폴더 및 컴포넌트 구조
```text
frontend/src
├── assets/        # 로고, 아이콘, 폰트 등 정적 자원
├── components/    # 여러 화면에서 재사용할 수 있는 공통 컴포넌트
├── pages/         # 독립적인 뷰(View) 단위 혹은 대형 탭 패널
├── App.jsx        # 전체 레이아웃 구성 및 최상위 라우팅
├── index.css      # 글로벌 디자인 토큰(CSS Variable) 및 다크 모드 스타일
└── main.jsx       # 렌더링 엔트리 포인트
```

### 네이밍 규칙
* **React 컴포넌트 파일 & 폴더**: PascalCase 사용 (예: `DoughnutChart.jsx`, `StockTable.jsx`)
* **일반 Javascript 파일, 함수, 변수**: camelCase 사용 (예: `useTheme.js`, `fetchAssets()`)
* **CSS 클래스명**: kebab-case 사용 (예: `glass-card`, `btn-add-stock`)

### 상태 관리 규칙
* UI의 로컬 UI 상태(예: 모달 ON/OFF, 활성 탭 등)는 각 컴포넌트 내부에서 `useState`로 폐쇄 관리합니다.
* 컴포넌트 트리를 가로지르는 광범위한 데이터 상태는 상위 컴포넌트(App.jsx)에서 통합 제어하거나 React Context API를 사용해 Props Drilling을 예방합니다.

---

## 6. API Convention

모든 통신은 동기화의 편의성을 위해 일관성 있는 **공통 포맷**을 적용합니다.

### 성공 응답 포맷 (HTTP 200/201)
```json
{
  "success": true,
  "data": {
    // 실제 응답 데이터 객체 또는 배열
  },
  "error": null
}
```

### 실패 응답 포맷 (HTTP 4xx/5xx)
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERR_RESOURCE_NOT_FOUND",
    "message": "수정하려는 ID의 자산 정보를 찾을 수 없습니다."
  }
}
```

### HTTP Status Code 기준
* **`200 OK`**: 일반 조회, 수정, 삭제 성공
* **`201 Created`**: 새로운 자원 등록 성공 (POST)
* **`400 Bad Request`**: 요청 값의 타입 미스매치, 필수 인자 누락 등 검증 실패
* **`404 Not Found`**: 조회하려는 자원(ID)이 존재하지 않는 경우
* **`500 Internal Server Error`**: 서버 내부 처리 과정 실패

---

## 7. Code Style

* **들여쓰기(Indent)**: 
  * Frontend (HTML, CSS, JS, JSX) ➡️ **2 spaces**
  * Backend (Java) ➡️ **4 spaces**
* **줄바꿈 한계**: 한 줄은 가독성을 위해 **120자**를 기준으로 꺾어 씁니다.
* **주석**: 메서드가 왜 구현되었는지 목적(Why)을 위주로 코드 상단에 한글 주석을 부드럽게 추가합니다. (기본 리액트 컴포넌트나 스프링 라이프사이클 같은 명백한 코드에는 주석을 최소화합니다.)
