// Header SDK Demo 초기화 스크립트
import "./index.ts";
import "./jk-header-v2.ts";
import "./jk-auth.ts";
import headerData from "./result/corporate.json" assert { type: "json" };

// 전역 변수로 설정
window.headerData = headerData;

// slotData 예시 (옵션)
window.slotData = {
  "recruit-title": {
    style: { "font-weight": "700" },
  },
};

// 테스트용 사용자 데이터
window.testUser = {
  id: "user123",
  name: "홍길동",
  email: "hong@example.com",
  type: "personal",
};

// GA 클릭 핸들러
window.handleGaClick = (ga) => {
  console.log("GA Click:", ga);
  // GA 트래킹 코드 여기에 추가
};

// 인증 토글 함수
window.toggleAuth = () => {
  const authComponent = document.getElementById("standalone-auth");
  if (authComponent) {
    if (authComponent.user) {
      authComponent.user = null;
    } else {
      authComponent.user = window.testUser;
    }
  }
};

// DOM 로드 후 초기화
document.addEventListener("DOMContentLoaded", () => {
  initializeTotalMenu();
  initializeHeader();
  setupEventListeners();
});

function initializeTotalMenu() {
  const totalMenu = document.getElementById("total-menu");
  if (totalMenu) {
    totalMenu.headerJson = window.headerData;
    totalMenu.slotData = window.slotData;
    totalMenu.gaClick = window.handleGaClick;
  }
}

function initializeHeader() {
  // 헤더 초기화 완료 - 자동 로그인 제거
}

// Promise 기반 로그인 시뮬레이션
function simulateLogin() {
  return new Promise((resolve) => {
    console.log("로그인 중...");
    setTimeout(() => {
      const header = document.querySelector("jk-header-v2");
      if (header) {
        header.user = window.testUser;
        console.log("로그인 완료!");
        resolve(window.testUser);
      }
    }, 3000);
  });
}

function setupEventListeners() {
  const log = document.getElementById("log");

  function writeLog(e) {
    if (!log) return;
    const time = new Date().toLocaleTimeString();
    const entry = `[${time}] ${e.type} -> ${JSON.stringify(e.detail)}\n`;
    log.textContent = entry + log.textContent;
  }

  // 이벤트 리스너 등록
  window.addEventListener("jk:navigate", writeLog);
  window.addEventListener("jk:search", writeLog);
  window.addEventListener("jk:error", writeLog);
  window.addEventListener("jk:auth", async (e) => {
    writeLog(e);
    
    // 로그인 액션 처리
    if (e.detail.action === "login") {
      try {
        await simulateLogin();
        writeLog({
          type: "auth:success",
          detail: { message: "로그인 성공", user: window.testUser }
        });
      } catch (error) {
        writeLog({
          type: "auth:error", 
          detail: { message: "로그인 실패", error }
        });
      }
    }
    
    // 로그아웃 액션 처리
    if (e.detail.action === "logout") {
      const header = document.querySelector("jk-header-v2");
      if (header) {
        header.user = null;
        writeLog({
          type: "auth:success",
          detail: { message: "로그아웃 완료" }
        });
      }
    }
  });

  // 로그 클리어 함수를 전역으로 설정
  window.clearLog = () => {
    if (log) {
      log.textContent = "이벤트가 여기에 표시됩니다...\n";
    }
  };

  // 테스트용 링크 클릭 이벤트 (Web Component 외부 링크만)
  document.addEventListener("click", (e) => {
    if (
      e.target.tagName === "A" &&
      e.target.href &&
      e.target.href.startsWith(window.location.origin) &&
      !e.target.closest("jk-nav") && // jk-nav 내부 링크 제외
      !e.target.closest("jk-search") && // jk-search 내부 링크 제외
      !e.target.closest("jk-header-v2") // jk-header-v2 내부 링크 제외
    ) {
      e.preventDefault();
      writeLog({
        type: "link:click",
        detail: { href: e.target.href, text: e.target.textContent },
      });
    }
  });
}
