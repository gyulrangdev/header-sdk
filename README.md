# JK Header SDK (Web Components)

잡코리아 헤더를 Web Component로 구현한 SDK입니다. 각 컴포넌트는 독립적으로 사용할 수 있으며, .NET(Razor)과 React 환경 모두에서 동일한 배포물을 사용할 수 있습니다.

## 🚀 빠른 시작

### 개발 서버 실행

```bash
npm run dev
```

### 빌드 (전체 SDK + 개별 컴포넌트)

```bash
npm run build
```

## 📦 컴포넌트 구성

### 1. 통합 헤더 컴포넌트

- `<jk-header-v2>`: 완전한 잡코리아 헤더 (상단 배너 + 검색 + 네비게이션)
- `<jk-header>`: 기본 헤더 (레거시)

### 2. 개별 컴포넌트

- `<jk-search>`: 검색창 + 자동완성 기능
- `<jk-nav>`: 메가메뉴 네비게이션

## 💻 사용법

### 전체 SDK 사용 (권장)

**정적/서버 렌더(.NET Razor 등)**

```html
<script defer src="/dist/header-sdk.iife.js"></script>
<jk-header-v2 env="prod" spa="false" locale="ko-KR"></jk-header-v2>
```

**React/번들러 환경**

```tsx
import "@jk/header-sdk";

function App() {
  return <jk-header-v2 env="prod" spa locale="ko-KR" />;
}
```

### 개별 컴포넌트 사용

**검색창만 사용**

```html
<script defer src="/dist/search.iife.js"></script>
<jk-search placeholder="검색어를 입력하세요"></jk-search>
```

**네비게이션만 사용**

```html
<script defer src="/dist/nav.iife.js"></script>
<jk-nav spa></jk-nav>
```

## ⚙️ 속성(Attributes)

### 공통 속성

- `spa`: SPA 라우팅 모드 (존재 여부로 true/false)
- `env`: `dev|staging|prod` (기본: prod)
- `locale`: 기본 `ko-KR`

### jk-search 전용

- `placeholder`: 검색창 플레이스홀더 텍스트

### jk-header-v2 전용

- `theme`: `light|dark|auto` (기본: light)
- `data-endpoints`: JSON 문자열 형태의 API 엔드포인트

## 🎯 이벤트(CustomEvent)

### jk:search

검색 실행 시 발생

```javascript
detail: {
  query: string;
}
```

### jk:navigate

SPA 모드에서 링크 클릭 시 발생

```javascript
detail: {
  href: string;
}
```

### jk:error

에러 발생 시

```javascript
detail: {
  code: string;
}
```

## 🔧 이벤트 처리 예제

### React에서 사용

```tsx
useEffect(() => {
  const handleSearch = (e: CustomEvent) => {
    console.log("검색:", e.detail.query);
  };

  const handleNavigate = (e: CustomEvent) => {
    navigate(e.detail.href);
  };

  window.addEventListener("jk:search", handleSearch as EventListener);
  window.addEventListener("jk:navigate", handleNavigate as EventListener);

  return () => {
    window.removeEventListener("jk:search", handleSearch as EventListener);
    window.removeEventListener("jk:navigate", handleNavigate as EventListener);
  };
}, []);
```

### 바닐라 JS에서 사용

```javascript
addEventListener("jk:search", (e) => {
  console.log("검색:", e.detail.query);
});

addEventListener("jk:navigate", (e) => {
  // SPA 라우팅 처리
  history.pushState(null, "", e.detail.href);
});
```

## 📁 빌드 결과물

### 전체 SDK

- `dist/header-sdk.es.js` - ESM 번들 (번들러용)
- `dist/header-sdk.iife.js` - IIFE 번들 (CDN/정적 페이지용)

### 개별 컴포넌트

- `dist/search.es.js` / `dist/search.iife.js` - 검색 컴포넌트
- `dist/nav.es.js` / `dist/nav.iife.js` - 네비게이션 컴포넌트
- `dist/header-v2.es.js` / `dist/header-v2.iife.js` - 통합 헤더

### 타입 선언

- `dist/types/` - TypeScript 타입 선언 파일들

## 🎨 CSS 변수 커스터마이징

```css
jk-header-v2 {
  --jk-color-primary: #1565c0;
  --jk-color-bg: #ffffff;
  --jk-font-family: "Custom Font", sans-serif;
}
```

## 🌍 배포 시나리오

### 시나리오 1: 전체 헤더 사용

`.NET` 환경에서 전체 헤더를 사용하고, 나중에 `React`로 마이그레이션

### 시나리오 2: 부분 마이그레이션

검색 기능만 먼저 Web Component로 교체하고, 점진적으로 네비게이션도 교체

### 시나리오 3: 마이크로프론트엔드

각 페이지별로 필요한 컴포넌트만 개별적으로 로드

## 📋 주요 특징

- ✅ **프레임워크 무관**: React, Vue, Angular, .NET 등 어디서나 사용
- ✅ **Shadow DOM**: 스타일 격리로 기존 CSS와 충돌 방지
- ✅ **타입 안전**: TypeScript 지원
- ✅ **접근성**: ARIA 속성 및 키보드 네비게이션 지원
- ✅ **반응형**: 모바일/데스크톱 대응
- ✅ **이벤트 기반**: 커스텀 이벤트로 외부와 통신
- ✅ **개별 배포**: 필요한 컴포넌트만 선택적 사용 가능

## 🔍 문제 해결

### SSR 환경에서 사용 시

```javascript
// Next.js 예시
import dynamic from "next/dynamic";

const HeaderLoader = dynamic(() => import("@jk/header-sdk"), {
  ssr: false,
});
```

### 스타일 충돌 시

Web Component는 Shadow DOM을 사용하므로 기본적으로 격리되지만,
필요한 경우 CSS 변수를 통해 스타일을 조정할 수 있습니다.

## 📞 지원

- 이슈: [GitHub Issues](링크)
- 문서: [SDK 문서](링크)
- 예제: `index.html` 파일 참조
