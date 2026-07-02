# 📈 Asset Manager (자산 관리자)

> 거시경제에 집중하는 한국인 미국주식 장기 투자자를 위한 자산 관리 서비스

---

## 📖 About

### 프로젝트 소개
본 프로젝트는 글로벌 거시경제(Macroeconomics)의 흐름을 주시하며 미국 주식에 장기 투자하는 한국인 투자자들을 돕기 위한 1인 자산 포트폴리오 관리 플랫폼입니다. 단순한 주가 추적을 넘어, 금리, 환율, 원자재 등 자산 가치에 영향을 미치는 주요 거시경제 지표와 실시간 핵심 뉴스를 한눈에 보며 장기 투자 전략을 수립할 수 있도록 돕습니다.

### 핵심 가치
* **지표 중심 의사결정**: 자산 현황과 함께 미국 국채 금리, 달러 인덱스, 공포지수(VIX) 등 핵심 경제 지표 9종을 동시에 제공하여 시야를 넓힙니다.
* **노이즈 없는 정보**: 장기 투자자에게 꼭 필요한 거시경제 주요 뉴스 10개 피드를 집중 제공합니다.


---

## 🛠 Tech Stack

### Frontend
* **Core**: React 19 (JavaScript)
* **Build Tool**: Vite 8
* **Styling**: Vanilla CSS (Premium Glassmorphism & Light/Dark Theme)
* **Visualization**: Chart.js & react-chartjs-2
* **Icons**: Font Awesome 6
* **Deployment**: Vercel

### Backend
* **Framework**: Spring Boot 3.5.11 (Java 17)
* **Database Access**: Spring Data JPA / Hibernate
* **Build Tool**: Gradle
* **Deployment**: Railway

### Database
* **RDBMS**: MySQL
* **Deployment**: Railway MySQL

---

## 📂 Project Structure

```text
project
├── .agents/       # AI 개발 에이전트 전용 규칙 및 커스텀 스킬
├── backend/       # Spring Boot 기반 백엔드 애플리케이션
│   ├── src/       # 컨트롤러, DTO, 서비스, 엔티티, 리소스
│   └── build.gradle
├── frontend/      # React + Vite 기반 프런트엔드 애플리케이션
│   ├── src/       # React 컴포넌트, 스타일, 로직
│   ├── vercel.json# Vercel SPA 라우팅 설정 파일
│   └── package.json
└── docs/          # 설계, API 명세, 아키텍처, 의사결정 기록 문서
```

---

## 📚 Documentation
* [프로젝트 개요 (Overview)](docs/01-project-overview.md)
* [MVP 스펙정의 (MVP Spec)](docs/02-mvp.md)
* [사용자 시나리오 (User Scenarios)](docs/03-user-scenarios.md)
* [API 명세서 (API Spec)](docs/04-api-spec.md)
* [컨벤션 정의 (Convention)](docs/05-convention.md)
* [의사결정 기록 (Decision Log)](docs/06-decisions.md)
* [시스템 아키텍처 (Architecture)](docs/07-architecture.md)

---

## 🚀 Getting Started

로컬 개발 환경을 세팅하고 실행하기 위한 가이드라인입니다. 모노레포 구조이므로 프런트엔드와 백엔드를 각각 독립된 터미널에서 실행해 주세요.

### Prerequisites
* Node.js (v18 이상 권장)
* Java JDK 17

### Environment Variables (.env)
프런트엔드 폴더(`frontend/`) 루트에 `.env` 파일을 생성하고 다음 변수를 입력합니다.
```env
VITE_API_URL=http://localhost:8080
```

### 1. Frontend Execution
```bash
cd frontend
npm install
npm run dev
```
* 로컬 서버 실행: `http://localhost:5173`

### 2. Backend Execution
```bash
cd backend
./gradlew bootRun
```
* 로컬 API 서버 실행: `http://localhost:8080`
