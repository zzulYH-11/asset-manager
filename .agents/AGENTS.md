# Custom Rules for Antigravity Coding Assistant

## ⚠️ 백엔드 코드 수정 및 설계 제약 규칙
1. **백엔드(Java/Spring Boot) 코드 직접 수정 금지**:
   - 백엔드 영역(Java 소스 코드, Spring 설정, 데이터베이스 스키마 및 DDL 등)에 변경이 필요할 경우, **절대로 AI 에이전트가 직접 코드를 수정해서는 안 됩니다.**
   - 수정이 필요한 사항은 반드시 구체적인 패치 가이드 및 설계 가이드 문서를 작성하여 사용자에게 텍스트나 아티팩트로 제공하고, 사용자가 직접 백엔드 코드를 수정할 수 있도록 유도해야 합니다.
   
2. **프론트엔드 영역의 자기완결성**:
   - 프론트엔드(HTML, CSS, JavaScript)는 AI 에이전트가 직접 코드를 작성하고 완결성 있게 유지 관리합니다.

## ⚠️ 프론트엔드 전담 AI 행동 지침 (Frontend AI Guidelines)
AI 에이전트가 프론트엔드 코드를 작성/수정할 때는 다음의 4가지 원칙을 엄격히 준수해야 합니다.

1. **기술 스택 동결 (Strict Tech Stack)**
   - 사용자의 명시적 허락 없이는 어떠한 새 npm 패키지(예: Tailwind, Redux 등)도 임의로 설치하지 않습니다.
   - 기존에 설정된 React 19, Vite, Vanilla CSS(Glassmorphism) 기반의 환경을 유지합니다.
2. **관심사의 분리 (Separation of Concerns)**
   - UI 컴포넌트(`pages/`, `components/`)와 비즈니스/통신 로직(`api/`, `utils/`, `hooks/`)을 철저히 분리하여 작성합니다.
3. **단일 진실 공급원 (Single Source of Truth)**
   - 백엔드 API와의 통신 로직은 컴포넌트 내부에 하드코딩하지 않고, 반드시 `src/api/client.js` 한 곳에 정의하여 재사용합니다.
4. **방어적 프로그래밍 (Defensive UX)**
   - 백엔드 통신 시 항상 데이터 로딩(Loading) 상태를 UI에 표시하고, 에러 발생 시 시스템 `alert()` 대신 `ToastContext`(`useToast`)를 사용하여 알림을 띄웁니다.
