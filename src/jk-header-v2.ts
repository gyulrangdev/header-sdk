import { LitElement, css, html } from "lit";
import { property } from "lit/decorators.js";
import type { Environment, ThemeMode, HeaderEndpoints } from "./types";

const HEADER_STYLES = css`
  :host {
    display: block;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, sans-serif;
    font-size: 13px;
    line-height: 1.5;
  }

  /* 상단 배너 */
  .top_banner {
    background: #6c5ce7;
    color: white;
    padding: 8px 0;
    font-size: 12px;
    text-align: center;
  }

  .top_banner a {
    color: white;
    text-decoration: none;
    font-weight: 500;
  }

  /* 메인 헤더 */
  .main_header {
    background: #fff;
    position: relative;
  }

  .header_container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    padding: 16px 20px;
    gap: 40px;
  }

  /* 브랜드 로고 */
  .brand {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: #1565c0;
    font-size: 24px;
    font-weight: bold;
    min-width: 140px;
  }

  .brand_icon {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #1565c0, #42a5f5);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
    font-weight: bold;
  }

  /* 검색 영역 */
  .search_area {
    flex: 1;
    max-width: 500px;
  }

  /* 우측 메뉴 */
  .top_menu {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-left: auto;
  }

  .top_menu a {
    color: #666;
    text-decoration: none;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .top_menu a:hover {
    color: #1565c0;
  }

  .top_menu .icon {
    width: 16px;
    height: 16px;
    opacity: 0.7;
  }

  .top_menu .login_area {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .top_menu .company_btn {
    background: #f5f5f5;
    color: #333;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 12px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition: background-color 0.2s;
  }

  .top_menu .company_btn:hover {
    background: #e0e0e0;
  }

  /* 네비게이션 영역 */
  .nav_area {
    width: 100%;
  }
`;

export class JkHeaderV2 extends LitElement {
  static styles = [HEADER_STYLES];

  @property({ type: String, reflect: true }) env: Environment = "prod";
  @property({ type: String, reflect: true }) theme: ThemeMode = "light";
  @property({ type: Boolean, reflect: true, attribute: "spa" }) spaMode = false;
  @property({ type: String, reflect: true }) locale: string = "ko-KR";
  @property({ type: String, attribute: "data-endpoints" }) endpointsAttr:
    | string
    | undefined;

  private endpoints: HeaderEndpoints = {};

  connectedCallback(): void {
    super.connectedCallback();
  }

  protected willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("endpointsAttr")) {
      this.endpoints = this.parseEndpoints(this.endpointsAttr);
    }
  }

  private parseEndpoints(value?: string): HeaderEndpoints {
    if (!value) return {};
    try {
      const obj = JSON.parse(value);
      return obj ?? {};
    } catch {
      this.dispatchEvent(
        new CustomEvent("jk:error", { detail: { code: "BAD_ENDPOINTS_JSON" } })
      );
      return {};
    }
  }

  private handleBrandClick = (ev: Event) => {
    const anchor = ev.currentTarget as HTMLAnchorElement | null;
    if (!anchor) return;
    if (this.spaMode) {
      ev.preventDefault();
      this.dispatchEvent(
        new CustomEvent("jk:navigate", {
          detail: { href: anchor.href },
          bubbles: true,
          composed: true,
        })
      );
    }
  };

  private handleLinkClick = (ev: Event) => {
    if (this.spaMode) {
      const anchor = ev.target as HTMLAnchorElement;
      if (anchor && anchor.href) {
        ev.preventDefault();
        this.dispatchEvent(
          new CustomEvent("jk:navigate", {
            detail: { href: anchor.href },
            bubbles: true,
            composed: true,
          })
        );
      }
    }
  };

  firstUpdated(): void {
    // 서브 컴포넌트 이벤트 리스닝
    this.addEventListener("jk:search", (e) => {
      // 검색 이벤트를 상위로 전파
      this.dispatchEvent(
        new CustomEvent("jk:search", {
          detail: (e as CustomEvent).detail,
          bubbles: true,
          composed: true,
        })
      );
    });

    this.addEventListener("jk:navigate", (e) => {
      // 네비게이션 이벤트를 상위로 전파
      this.dispatchEvent(
        new CustomEvent("jk:navigate", {
          detail: (e as CustomEvent).detail,
          bubbles: true,
          composed: true,
        })
      );
    });
  }

  render() {
    return html`
      <!-- 상단 배너 -->
      <div class="top_banner">
        <a href="/ai-challenge"
          >총 상금 1000만원! 잡코리아 AI 챌린지 도전하세요</a
        >
      </div>

      <!-- 메인 헤더 -->
      <div class="main_header">
        <div class="header_container">
          <!-- 브랜드 로고 -->
          <a
            class="brand"
            href="/"
            @click=${this.handleBrandClick}
            aria-label="잡코리아 홈"
          >
            <div class="brand_icon">JK</div>
            <span>JOBKOREA</span>
          </a>

          <!-- 검색 영역 -->
          <div class="search_area">
            <jk-search
              ?spa=${this.spaMode}
              placeholder="키워드를 입력하시면
검색어를 추천해드립니다."
            >
            </jk-search>
          </div>

          <!-- 우측 메뉴 -->
          <div class="top_menu">
            <a href="/app" @click=${this.handleLinkClick}>
              <span class="icon">📱</span>
              앱다운
            </a>
            <a href="/global" @click=${this.handleLinkClick}>
              <span class="icon">🌐</span>
              게임잡
            </a>
            <a href="/9hire" @click=${this.handleLinkClick}>
              <span class="icon">💼</span>
              나인하이어
            </a>
            <div class="login_area">
              <a href="/login" @click=${this.handleLinkClick}>로그인</a>
              <a href="/register" @click=${this.handleLinkClick}>회원가입</a>
              <a
                href="/company"
                class="company_btn"
                @click=${this.handleLinkClick}
                >기업서비스</a
              >
            </div>
          </div>
        </div>
      </div>

      <!-- 네비게이션 영역 -->
      <div class="nav_area">
        <jk-nav ?spa=${this.spaMode}></jk-nav>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "jk-header-v2": JkHeaderV2;
  }
}

if (!customElements.get("jk-header-v2")) {
  customElements.define("jk-header-v2", JkHeaderV2);
}
