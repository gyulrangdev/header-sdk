import { LitElement, css, html } from "lit";
import { property } from "lit/decorators.js";
import type { Environment, ThemeMode, HeaderEndpoints } from "./types";

const BASE_STYLES = css`
  :host {
    display: block;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, sans-serif;
    font-size: 13px;
    line-height: 1.5;
  }

  /* 전체 래퍼 */
  .wrapper {
    background: #fff;
    border-bottom: 1px solid #e6e6e6;
    position: relative;
  }

  /* 내부 컨테이너 */
  .container {
    max-width: 1440px;
    margin: 0 auto;
    position: relative;
    height: 85px;
    display: flex;
    align-items: center;
    padding: 0 20px;
  }

  /* 브랜드 로고 */
  .brand {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    margin-right: 10px;
  }

  .brand img {
    height: 70px;
    width: auto;
  }

  /* 검색 영역 (searchWrap) */
  #searchWrap {
    position: relative;
    flex: 1;
    max-width: 580px;
    margin: 0 40px 0 0;
  }

  #searchWrap .search_form {
    position: relative;
    display: flex;
    align-items: center;
    background: #fff;
    border: 2px solid #0066cc;
    border-radius: 2px;
    height: 48px;
  }

  #searchWrap input[type="text"] {
    flex: 1;
    height: 100%;
    border: none;
    outline: none;
    padding: 0 50px 0 16px;
    font-size: 16px;
    background: transparent;
    color: #333;
  }

  #searchWrap input[type="text"]::placeholder {
    color: #999;
    font-size: 16px;
  }

  #searchWrap .search_btn {
    position: absolute;
    right: 0;
    top: 0;
    width: 48px;
    height: 48px;
    background: #0066cc;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #searchWrap .search_btn::before {
    content: "🔍";
    color: white;
    font-size: 16px;
  }

  /* 자동완성 (searchList) */
  .searchList {
    position: absolute;
    top: calc(100% + 2px);
    left: 0;
    right: 0;
    background: #fff;
    border: 1px solid #ddd;
    border-top: none;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    max-height: 400px;
    overflow-y: auto;
    display: none;
  }

  .searchList.show {
    display: block;
  }

  .searchList ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .searchList li {
    padding: 12px 16px;
    cursor: pointer;
    border-bottom: 1px solid #f5f5f5;
    font-size: 14px;
    color: #333;
  }

  .searchList li:hover {
    background-color: #f8f9fa;
  }

  .searchList li:last-child {
    border-bottom: none;
  }

  /* 헤더 네비게이션 (headNavBar) */
  #headNavBar {
    display: flex;
    align-items: center;
    height: 100%;
    margin-left: auto;
  }

  #headNavBar .gnb {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    align-items: center;
    height: 100%;
  }

  #headNavBar .item {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
  }

  #headNavBar .item > a {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 100%;
    color: #333;
    text-decoration: none;
    font-size: 15px;
    font-weight: 500;
    transition: background-color 0.2s;
  }

  #headNavBar .item:hover > a,
  #headNavBar .item.active > a {
    background-color: #f8f9fa;
  }

  /* 서브메뉴 (depth2) */
  #headNavBar .depth2 {
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 200px;
    background: #fff;
    border: 1px solid #ddd;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 999;
    display: none;
    padding: 8px 0;
  }

  #headNavBar .item:hover .depth2 {
    display: block;
  }

  #headNavBar .depth2 a {
    display: block;
    padding: 10px 20px;
    color: #333;
    text-decoration: none;
    font-size: 14px;
    transition: background-color 0.2s;
  }

  #headNavBar .depth2 a:hover {
    background-color: #f8f9fa;
  }

  /* open-active 상태 */
  #headNavBar.open-active {
    /* 필요한 경우 추가 스타일 */
  }

  /* 우측 유틸리티 메뉴 */
  .util_menu {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-left: 20px;
  }

  .util_menu a {
    color: #666;
    text-decoration: none;
    font-size: 13px;
  }

  .util_menu a:hover {
    color: #0066cc;
  }
`;

export class JkHeader extends LitElement {
  static styles = [BASE_STYLES];

  @property({ type: String, reflect: true }) env: Environment = "prod";
  @property({ type: String, reflect: true }) theme: ThemeMode = "light";
  @property({ type: Boolean, reflect: true, attribute: "spa" }) spaMode = false;
  @property({ type: String, reflect: true }) locale: string = "ko-KR";
  @property({ type: String, attribute: "data-endpoints" }) endpointsAttr:
    | string
    | undefined;

  private endpoints: HeaderEndpoints = {};
  private searchQuery: string = "";
  private suggestions: string[] = [
    "잡코리아 AI 챌린지",
    "채용정보",
    "원픽",
    "AI잡스",
    "하이테크",
    "공채정보",
    "헤드헌팅",
    "기업리뷰",
    "연봉정보",
    "취업톡톡",
    "개발자 채용",
    "디자이너 채용",
    "마케팅 채용",
    "영업 채용",
    "서울 채용",
    "경기 채용",
  ];
  private filteredSuggestions: string[] = [];
  private showAutocomplete = false;
  private hasNavHover = false;

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

  private onSearchInput = (ev: Event) => {
    const input = ev.target as HTMLInputElement;
    this.searchQuery = input.value;

    if (this.searchQuery.trim()) {
      this.filteredSuggestions = this.suggestions
        .filter((s) => s.toLowerCase().includes(this.searchQuery.toLowerCase()))
        .slice(0, 8);
      this.showAutocomplete = this.filteredSuggestions.length > 0;
    } else {
      this.showAutocomplete = false;
    }
    this.requestUpdate();
  };

  private onSearchFocus = () => {
    if (this.searchQuery.trim() && this.filteredSuggestions.length > 0) {
      this.showAutocomplete = true;
      this.requestUpdate();
    }
  };

  private onSearchBlur = () => {
    // 약간의 딜레이를 주어 클릭 이벤트가 처리되도록 함
    setTimeout(() => {
      this.showAutocomplete = false;
      this.requestUpdate();
    }, 150);
  };

  private onSuggestionClick = (suggestion: string) => {
    this.searchQuery = suggestion;
    this.showAutocomplete = false;
    this.dispatchEvent(
      new CustomEvent("jk:search", {
        detail: { query: suggestion },
        bubbles: true,
        composed: true,
      })
    );
    this.requestUpdate();
  };

  private onSearchSubmit = (ev: Event) => {
    ev.preventDefault();
    if (this.searchQuery.trim()) {
      this.showAutocomplete = false;
      this.dispatchEvent(
        new CustomEvent("jk:search", {
          detail: { query: this.searchQuery },
          bubbles: true,
          composed: true,
        })
      );
    }
  };

  private onNavMouseEnter = () => {
    this.hasNavHover = true;
    this.requestUpdate();
  };

  private onNavMouseLeave = () => {
    this.hasNavHover = false;
    this.requestUpdate();
  };

  firstUpdated(): void {
    if (this.shadowRoot) {
      this.interceptLinkClicks(this.shadowRoot);
    }
  }

  private interceptLinkClicks(root: ShadowRoot) {
    root.addEventListener("click", (ev) => {
      if (!this.spaMode) return;
      const target = ev.target as Element;
      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (anchor && anchor.href && anchor.getAttribute("target") !== "_blank") {
        ev.preventDefault();
        this.dispatchEvent(
          new CustomEvent("jk:navigate", {
            detail: { href: anchor.href },
            bubbles: true,
            composed: true,
          })
        );
      }
    });
  }

  render() {
    return html`
      <header class="wrapper" role="banner">
        <div class="container">
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
          <div id="searchWrap">
            <form class="search_form" @submit=${this.onSearchSubmit}>
              <input
                type="text"
                placeholder="Smart Match 통합검색"
                .value=${this.searchQuery}
                @input=${this.onSearchInput}
                @focus=${this.onSearchFocus}
                @blur=${this.onSearchBlur}
                aria-label="통합검색"
              />
              <button
                type="submit"
                class="search_btn"
                aria-label="검색"
              ></button>
            </form>

            <!-- 자동완성 리스트 -->
            <div class="searchList ${this.showAutocomplete ? "show" : ""}">
              <ul>
                ${this.filteredSuggestions.map(
                  (suggestion) => html`
                    <li @mousedown=${() => this.onSuggestionClick(suggestion)}>
                      ${suggestion}
                    </li>
                  `
                )}
              </ul>
            </div>
          </div>

          <!-- 헤더 네비게이션 -->
          <nav
            id="headNavBar"
            class=${this.hasNavHover ? "open-active" : ""}
            @mouseenter=${this.onNavMouseEnter}
            @mouseleave=${this.onNavMouseLeave}
          >
            <ul class="gnb">
              <li class="item">
                <a href="/recruit">채용정보</a>
                <div class="depth2">
                  <a href="/recruit/area">지역별</a>
                  <a href="/recruit/job">직무별</a>
                  <a href="/recruit/company">기업별</a>
                  <a href="/recruit/industry">산업별</a>
                  <a href="/recruit/top100">TOP100</a>
                  <a href="/recruit/premium">전문채용관</a>
                </div>
              </li>
              <li class="item">
                <a href="/onepick">원픽</a>
                <div class="depth2">
                  <a href="/onepick/congratulations">합격축하금 공고</a>
                  <a href="/onepick/service">원픽서비스 안내</a>
                </div>
              </li>
              <li class="item">
                <a href="/gongchae">공채정보</a>
                <div class="depth2">
                  <a href="/gongchae/1000">1000대기업 공채</a>
                  <a href="/gongchae/calendar">공채달력</a>
                  <a href="/gongchae/public">공공기관 채용일정</a>
                </div>
              </li>
              <li class="item">
                <a href="/headhunting">헤드헌팅</a>
                <div class="depth2">
                  <a href="/headhunting/recruit">헤드헌팅 채용정보</a>
                  <a href="/headhunting/follow">팔로우 헤드헌터</a>
                  <a href="/headhunting/find">헤드헌터 찾기</a>
                  <a href="/headhunting/consult">채용 상담</a>
                </div>
              </li>
              <li class="item">
                <a href="/company">기업·연봉</a>
                <div class="depth2">
                  <a href="/company/review">기업리뷰</a>
                  <a href="/company/salary">연봉</a>
                  <a href="/company/report">기업분석보고서</a>
                </div>
              </li>
              <li class="item">
                <a href="/career">커리어</a>
                <div class="depth2">
                  <a href="/career/lab">콘텐츠LAB</a>
                  <a href="/career/cover-letter">합격자소서</a>
                  <a href="/career/interview">인적성 면접 후기</a>
                  <a href="/career/test">인성역량검사</a>
                  <a href="/career/mock">공기업 모의고사</a>
                </div>
              </li>
              <li class="item">
                <a href="/jobtalk">취업톡톡</a>
              </li>
            </ul>
          </nav>

          <!-- 우측 유틸리티 메뉴 -->
          <div class="util_menu">
            <a href="/login">로그인</a>
            <a href="/register">회원가입</a>
            <a href="/service/company">기업서비스</a>
          </div>
        </div>
      </header>
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
