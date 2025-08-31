# JK Header SDK

잡코리아 헤더를 Web Component로 구현한 SDK입니다. Lit 프레임워크 기반으로 개발되었으며, 프레임워크에 관계없이 사용할 수 있습니다.

## ✨ 주요 특징

- 🎯 **Slot 기반 컴포넌트 구조**: 유연한 컴포넌트 조합 및 커스터마이징
- 🔒 **독립적인 인증 관리**: jk-auth 컴포넌트를 외부에서 주입하여 로그인 상태 제어
- 🎨 **부드러운 UI 전환**: CSS transition을 통한 깜빡임 없는 상태 변경
- 🌐 **SPA 라우팅 지원**: 커스텀 이벤트를 통한 네비게이션 제어
- 📱 **반응형 디자인**: 데스크톱과 모바일 환경 모두 지원

## 📋 프로젝트 개요

- **기술 스택**: TypeScript, Lit (Web Components), Vite
- **빌드 타겟**: ES2020
- **패키지명**: `@jk/header-sdk`
- **Node 버전**: 18 이상 필요

## 🏗️ 프로젝트 구조

```
src/
├── api/                    # API 관련 코드
│   ├── auto-complete.api.ts    # 자동완성 API
│   ├── http-client.ts          # HTTP 클라이언트
│   ├── index.ts               # API 모듈 진입점
│   ├── mock-data.json         # 목 데이터
│   └── types.ts               # API 타입 정의
├── assets/                 # 정적 자산
│   └── logo_motion_pc.gif     # 로고 이미지
├── result/                 # 더미 데이터
│   └── corporate.json         # 기업 정보 데이터
├── index.ts               # 메인 진입점
├── types.ts               # 공통 타입 정의
├── demo.js               # 데모용 스크립트 (이벤트 처리 및 테스트)
├── jk-header.ts          # 통합 헤더 컴포넌트 (Slot 기반)
├── jk-auth.ts            # 인증 컴포넌트 (attribute 기반 상태 관리)
├── jk-search.ts          # 검색 컴포넌트 (자동완성 포함)
├── jk-nav.ts             # 네비게이션 컴포넌트 (메가메뉴 포함)
└── jk-total-menu.ts      # 전체메뉴 컴포넌트
```

## 🚀 개발 환경 설정

### 요구사항

- Node.js 18 이상
- npm 또는 pnpm

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 타입 체크
npm run typecheck

# 빌드 파일 정리
npm run clean
```

## 📦 컴포넌트

### 핵심 컴포넌트

- **`jk-header`**: 완전한 통합 헤더 (배너 + 로고 + 검색 + 네비게이션), Slot 기반 구조
- **`jk-auth`**: 로그인/로그아웃 인증 컴포넌트 (외부 주입 방식)
- **`jk-search`**: 검색창 및 자동완성 기능
- **`jk-nav`**: 메인 네비게이션 (메가메뉴 포함)
- **`jk-total-menu`**: 전체메뉴 컴포넌트

### 컴포넌트 속성

#### 공통 속성
- `spa` (boolean): SPA 모드 활성화
- `env` (string): 환경 설정 (dev, staging, prod)
- `locale` (string): 로케일 설정 (기본: ko-KR)

#### jk-header 전용
- `theme` (string): 테마 모드 (light, dark, auto)

#### jk-auth 전용
- `logged-in` (boolean): 로그인 상태 여부
- `user` (string): 사용자 정보 JSON 문자열
  ```html
  <!-- 로그인 상태 예시 -->
  <jk-auth logged-in user='{"id":"123","name":"홍길동","email":"user@example.com","type":"personal"}'></jk-auth>
  ```

## 💻 사용법

### HTML에서 사용

#### 기본 사용법 (Slot을 통한 인증 컴포넌트 주입)

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="/dist/header-sdk.es.js"></script>
</head>
<body>
  <!-- Slot을 활용한 인증 컴포넌트 주입 -->
  <jk-header env="prod" spa locale="ko-KR">
    <!-- 헤더 인증 영역 -->
    <jk-auth 
      slot="auth" 
      spa 
      logged-in 
      user='{"id":"user123","name":"홍길동","email":"hong@example.com","type":"personal"}'>
    </jk-auth>
    
    <!-- 네비게이션 인증 영역 -->
    <jk-auth 
      slot="nav-auth" 
      spa 
      logged-in 
      user='{"id":"user123","name":"홍길동","email":"hong@example.com","type":"personal"}'>
    </jk-auth>
  </jk-header>
</body>
</html>
```

#### 로그아웃 상태

```html
<jk-header env="prod" spa locale="ko-KR">
  <!-- 로그아웃 상태 (logged-in 속성 없음) -->
  <jk-auth slot="auth" spa></jk-auth>
  <jk-auth slot="nav-auth" spa></jk-auth>
</jk-header>
```

### React에서 사용

```tsx
import "@jk/header-sdk";
import { useEffect, useState } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "jk-header": any;
      "jk-auth": any;
    }
  }
}

function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleSearch = (e: CustomEvent) => {
      console.log("검색:", e.detail.query);
    };

    const handleNavigate = (e: CustomEvent) => {
      console.log("네비게이션:", e.detail.href);
      // SPA 라우팅 처리
    };

    const handleAuth = (e: CustomEvent) => {
      if (e.detail.action === "login") {
        // 로그인 처리 로직
        setIsLoggedIn(true);
        setUser({ id: "123", name: "홍길동", email: "user@example.com", type: "personal" });
      } else if (e.detail.action === "logout") {
        // 로그아웃 처리 로직
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    window.addEventListener("jk:search", handleSearch);
    window.addEventListener("jk:navigate", handleNavigate);
    window.addEventListener("jk:auth", handleAuth);

    return () => {
      window.removeEventListener("jk:search", handleSearch);
      window.removeEventListener("jk:navigate", handleNavigate);
      window.removeEventListener("jk:auth", handleAuth);
    };
  }, []);

  return (
    <div>
      <jk-header env="prod" spa locale="ko-KR">
        <jk-auth 
          slot="auth" 
          spa 
          logged-in={isLoggedIn}
          user={user ? JSON.stringify(user) : undefined}
        />
        <jk-auth 
          slot="nav-auth" 
          spa 
          logged-in={isLoggedIn}
          user={user ? JSON.stringify(user) : undefined}
        />
      </jk-header>
    </div>
  );
}
```

## 🎯 이벤트

SDK는 다음과 같은 커스텀 이벤트를 발생시킵니다:

- **`jk:search`**: 검색 실행 시 (`detail: { query: string }`)
- **`jk:navigate`**: SPA 네비게이션 시 (`detail: { href: string, text?: string, source?: string }`)
- **`jk:auth`**: 인증 관련 액션 시 (`detail: { action: "login" | "logout" | "register" }`)
- **`jk:error`**: 에러 발생 시 (`detail: { code: string }`)

### 이벤트 사용 예제

```javascript
// 검색 이벤트 처리
window.addEventListener('jk:search', (e) => {
  console.log('검색어:', e.detail.query);
  // 검색 API 호출 또는 라우팅 처리
});

// 네비게이션 이벤트 처리 (SPA 라우팅)
window.addEventListener('jk:navigate', (e) => {
  console.log('네비게이션:', e.detail);
  // React Router, Vue Router 등을 통한 라우팅 처리
  // history.pushState() 또는 router.push() 등 사용
});

// 인증 이벤트 처리
window.addEventListener('jk:auth', (e) => {
  const { action } = e.detail;
  switch(action) {
    case 'login':
      // 로그인 모달 열기 또는 로그인 페이지로 이동
      break;
    case 'logout':
      // 로그아웃 처리
      break;
    case 'register':
      // 회원가입 페이지로 이동
      break;
  }
});
```

## 🛠️ 빌드 설정

Vite 설정에서 라이브러리 모드로 빌드됩니다:

- **ES 모듈**: `dist/header-sdk.es.js`
- **IIFE**: `dist/header-sdk.iife.js`
- **타입 정의**: `dist/types/`

모든 의존성이 번들에 포함되어 CDN에서 바로 사용할 수 있습니다.

## 🎨 스타일링

Web Component는 Shadow DOM을 사용하여 스타일이 격리됩니다. 커스터마이징이 필요한 경우 CSS 변수를 통해 조정할 수 있습니다.

### 주요 CSS 특징

- **부드러운 전환 효과**: 로그인/로그아웃 상태 변경 시 CSS transition 적용
- **반응형 디자인**: 다양한 화면 크기에 대응하는 반응형 레이아웃
- **메가메뉴**: 네비게이션 호버 시 표시되는 풍부한 메가메뉴 UI
- **Shadow DOM 격리**: 외부 스타일과의 충돌 방지

## 🧪 테스트 및 데모

`index.html` 파일에서 모든 컴포넌트의 데모와 이벤트 로깅을 확인할 수 있습니다. 개발 서버를 실행하면 브라우저에서 자동으로 데모 페이지가 열립니다.

### 데모 페이지 기능

- **통합 헤더**: Slot을 통해 주입된 jk-auth 컴포넌트와 함께 완전한 헤더 표시
- **개별 컴포넌트 테스트**: 각 컴포넌트를 독립적으로 테스트
- **이벤트 로깅**: 실시간 이벤트 모니터링 및 디버깅
- **인증 상태 토글**: 로그인/로그아웃 상태 전환 테스트
- **전체메뉴**: 모바일 환경을 위한 전체메뉴 컴포넌트 데모

### 주요 테스트 케이스

1. **Slot 기반 인증**: 헤더와 네비게이션 영역의 독립적인 인증 컴포넌트 관리
2. **SPA 라우팅**: 네비게이션 클릭 시 jk:navigate 이벤트 발생 확인
3. **검색 기능**: 자동완성 API 연동 및 jk:search 이벤트 처리
4. **상태 전환**: CSS transition을 통한 부드러운 UI 변경 확인

## 🔧 개발 가이드

### 새 컴포넌트 추가

1. `src/` 디렉토리에 `jk-[컴포넌트명].ts` 파일 생성
2. Lit의 `LitElement`를 상속받아 구현
3. `src/index.ts`에 import 추가
4. TypeScript 타입이 필요한 경우 `src/types.ts`에 정의

### API 연동

API 관련 코드는 `src/api/` 디렉토리에 구현되어 있습니다:
- **HTTP 클라이언트**: `http-client.ts` - 공통 HTTP 요청 처리
- **자동완성 API**: `auto-complete.api.ts` - 검색 자동완성 기능
- **타입 정의**: `types.ts` - API 관련 TypeScript 타입
- **목 데이터**: `mock-data.json` - 개발용 더미 데이터
- **모듈 진입점**: `index.ts` - API 모듈 통합 진입점

### Slot 패턴 활용

이 프로젝트는 Web Components의 Slot 패턴을 적극 활용하여 컴포넌트의 유연성을 높였습니다:

```typescript
// jk-header 컴포넌트에서 인증 영역을 slot으로 처리
render() {
  return html`
    <div class="top_menu">
      <slot name="auth">
        <!-- 기본 인증 UI (slot이 비어있을 때) -->
        <div class="auth-links">
          <a href="/login">로그인</a>
          <a href="/register">회원가입</a>
        </div>
      </slot>
    </div>
  `;
}
```

이를 통해 인증 컴포넌트를 외부에서 주입하여 독립적으로 관리할 수 있습니다.

## 📝 주요 개발 히스토리

### 최근 업데이트 (v0.1.0)

- **Slot 기반 아키텍처 도입**: jk-header와 jk-nav에서 인증 컴포넌트를 slot으로 주입
- **독립적인 인증 관리**: jk-auth 컴포넌트를 attribute 기반으로 외부에서 제어
- **부드러운 UI 전환**: CSS transition을 활용한 깜빡임 없는 상태 변경
- **이벤트 시스템 개선**: 더 상세한 이벤트 정보 제공 (source, text 등)
- **API 모듈 구조화**: 자동완성 및 HTTP 클라이언트 모듈 정리

### 초기 커밋 이력

- `7d69274`: total-menu 추가 및 로그인 데모 추가  
- `bd0e821`: 헤더 및 네비게이션 스타일 업데이트, 로고 이미지 적용
- `028a0db`: README 추가
- `56a3708`: lock 파일 추가
- `f39a5c1`: 프로젝트 초기 설정

## 🚀 향후 계획

- [ ] 테마 커스터마이징 API 확장
- [ ] 다국어 지원 강화
- [ ] 접근성(A11y) 개선
- [ ] 컴포넌트 단위 테스트 추가
- [ ] Storybook 도입 검토

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새 기능 브랜치를 생성합니다 (`git checkout -b feature/새기능`)
3. 변경사항을 커밋합니다 (`git commit -am '새 기능 추가'`)
4. 브랜치를 푸시합니다 (`git push origin feature/새기능`)
5. Pull Request를 생성합니다
