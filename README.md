# EvolveSoft 표준 프레임워크 FE

### 개요
Evolve 시스템의 프론트엔드 애플리케이션으로,  
백엔드 API 서버(evolve-be)와 연동하여 데이터를 시각화하고 사용자 인터페이스(UI)를 제공합니다.

메뉴 관리, 권한 관리, 사용자 관리, 코드 관리, 메시지 관리, 로그 등  
시스템 설정(관리자용) 기능을 중심으로 구성되어 있으며,  
`React`와 `TypeScript`를 기반으로 설계되고 개발되었습니다.

---

### 기술 스택
| 구분          | 기술                          |
|--------------|-------------------------------|
| 런타임        | node.js 22                    |
| 프레임워크    | React 18 + Vite + TypeScript  |
| 상태관리      | Zustand                       |
| 데이터 통신   | Axios + TanStack Query        |
| 폼 검증       | React Hook Form + Zod         |
| 다국어(i18n)  | react-i18next                 |
| UI            | TailwindCSS + shadcn/ui       |

---

### 주요 기능

- **시스템 설정(Admin):** 메뉴, 권한, 사용자, 코드, 로그 ...
- **로그인 / 가입 / 인증**
- **다국어(i18n)** 지원
- **API 캐싱 및 비동기 데이터 관리** (TanStack Query)
- **타입 안전성과 유효성 검증** (TypeScript + Zod)
- **일부 공통 UI 컴포넌트 제공** (모달, 테이블, 다이얼로그, 페이징 등)

---

### 폴더 구조
```text
src
 ├── api/           # Axios 기반 API 호출부
 ├── components/    # UI 컴포넌트 (페이지 구성요소)
 ├── config/        # 환경 설정 (Api 설정 등)
 ├── constants/     # 공통 상수
 ├── hooks/         # 커스텀 훅
 ├── lib/           # 라이브러리(공통 유틸/헬퍼)
 ├── locales/       # 다국어(i18n) 리소스
 ├── mocks/         # 테스트용 Mock 데이터
 ├── pages/         # 페이지 단위 화면
 ├── queries/       # TanStack Query 정의
 ├── schemas/       # Zod 유효성 검사 스키마
 ├── store/         # Zustand 전역 상태
 ├── styles/        # 전역 스타일 (Tailwind)
 └── types/         # 타입 정의 (interface 등)
```

---

### 실행방법

### 1. Node.js 설치
- 먼저 [Node.js 공식 사이트](https://nodejs.org/ko/download)에서 최신 또는 필요 버전을 설치
- 프로젝트 사용 버전 - Node.js 22

### 2. 패키지 설치
- 필요한 의존성을 설치
```text
npm install
```

### 3. 개발 서버 실행
- 로컬 환경에서 개발 서버를 실행
```text
 npm run dev
```

### 4. 프로덕션 빌드
- 배포용으로 프로젝트를 빌드
- 결과물은 dist/ 디렉토리에 생성
```text
 npm run build
 npm run preview
```
- npm run preview 명령으로 로컬 빌드 결과를 미리 확인 가능

### 5. Lint 검사
- 코드 스타일과 포맷을 검사
- ESLint 및 Prettier 규칙을 기반
```text
 npm run lint
```

### 6. 기타명령어
- 추가적인 개발, 빌드, 테스트 관련 명령어는 `package.json`의 `scripts` 항목에서 확인

---

### 코드 스타일 및 협업 규칙
### 커밋 컨벤션 (Git)
| 유형     | 설명            |
|----------|---------------|
| feat     | 새로운 기능 추가     |
| fix      | 버그 수정         |
| refactor | 코드 리팩토링       |
| docs     | 문서 수정         |
| style    | 코드 스타일 변경     |
| test     | 테스트 코드 추가     |
| chore    | 빌드 및 환경 설정 변경 |

```text
예시:
feat: 로그인 토큰 자동 갱신 기능 추가
fix: 게시글 페이징 오류 수정
```

### Git Commit / Push 전 검증 절차
프로젝트 품질 유지를 위해 코드 커밋 전 아래 절차를 수행
### 1. 빌드 확인
- 빌드 에러가 없어야 하며 dist/ 디렉토리가 정상 생성되어야 함
```text
npm run build
```
### 2. Lint 검사
- ESLint 및 Prettier 규칙 위반 시 오류 메시지가 표시
- 모든 오류를 수정한 후 커밋, 수정 가능한 경고는 수정
```text
npm run lint
```

---
