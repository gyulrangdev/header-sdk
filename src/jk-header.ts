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
    text-decoration: none;
    min-width: 140px;
  }

  .brand img {
    height: 70px;
    width: auto;
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
    color: #003cff;
  }

  .top_menu .icon {
    width: 16px;
    height: 16px;
    opacity: 0.7;
  }

  .auth-links {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .auth-links a {
    color: #666;
    text-decoration: none;
    font-size: 13px;
  }

  .auth-links a:hover {
    color: #003cff;
  }

  /* 네비게이션 영역 */
  .nav_area {
    width: 100%;
  }
`;

export class JkHeader extends LitElement {
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

    this.addEventListener("jk:auth", (e) => {
      // 인증 이벤트를 상위로 전파
      this.dispatchEvent(
        new CustomEvent("jk:auth", {
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
            <img src="./src/assets/logo_motion_pc.gif" alt="JOBKOREA" />
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
            <slot name="auth">
              <!-- 기본 인증 UI (slot이 비어있을 때 표시) -->
              <div class="auth-links">
                <a href="/login" @click=${this.handleLinkClick}>로그인</a>
                <a href="/register" @click=${this.handleLinkClick}>회원가입</a>
              </div>
            </slot>
          </div>
        </div>
      </div>

      <!-- 네비게이션 영역 -->
      <div class="nav_area">
        <jk-nav ?spa=${this.spaMode}>
          <slot name="nav-auth" slot="nav-auth"></slot>
        </jk-nav>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "jk-header": JkHeader;
  }
}

if (!customElements.get("jk-header")) {
  customElements.define("jk-header", JkHeader);
}
