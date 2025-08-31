import { LitElement, css, html } from "lit";
import { property } from "lit/decorators.js";

const NAV_STYLES = css`
  :host {
    display: block;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, sans-serif;
    font-size: 13px;
  }

  /* 헤더 네비게이션 컨테이너 */
  #headNavBar {
    position: relative;
    background: #fff;
    height: 50px;
    border-bottom: 1px solid #e0e0e0;
  }

  /* 메인 네비게이션 */
  .gnb {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    align-items: center;
    height: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .nav_item {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    margin-right: 40px;
  }

  .nav_item:last-child {
    margin-right: 0;
  }

  .nav_item > a {
    display: flex;
    align-items: center;
    height: 100%;
    color: #333;
    text-decoration: none;
    font-size: 15px;
    font-weight: 500;
    padding: 0 8px;
    transition: color 0.2s;
    position: relative;
  }

  .nav_item:hover > a,
  .nav_item.active > a {
    color: #1565c0;
  }

  /* 원픽 아이콘 */
  .nav_item.onepick > a {
    color: #1565c0;
    font-weight: 600;
  }

  .nav_item.onepick > a::before {
    content: "";
    display: inline-block;
    width: 14px;
    height: 14px;
    margin-right: 4px;
    background: #4caf50;
    border-radius: 50%;
    position: relative;
  }

  .nav_item.onepick > a::after {
    content: "";
    position: absolute;
    left: 4px;
    top: 6px;
    width: 6px;
    height: 3px;
    border: solid white;
    border-width: 0 0 2px 2px;
    transform: rotate(-45deg);
  }

  /* 메가메뉴 배경 */
  .mega_menu_bg {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #fff;
    border-bottom: 1px solid #e0e0e0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 999;
    display: none;
  }

  #headNavBar.open-active .mega_menu_bg {
    display: block;
  }

  /* 메가메뉴 컨테이너 */
  .mega_menu_container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px 20px;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: auto auto auto;
    gap: 30px;
  }

  /* 메가메뉴 섹션  */
  .mega_section {
    display: block;
  }

  .mega_section h3 {
    font-size: 18px;
    font-weight: 700;
    color: #333;
    margin: 0 0 16px 0;
    padding-bottom: 8px;
    transition: all 0.2s;
    cursor: pointer;
  }

  .mega_section h3 {
    position: relative;
  }

  .mega_section h3 svg {
    margin-left: 6px;
    transition: transform 0.2s ease;
    width: 16px;
    height: 16px;
  }

  .mega_section h3:hover svg {
    transform: translateX(2px);
  }

  .mega_section .sub_menu_group {
    margin-bottom: 16px;
  }

  .mega_section .sub_menu_group h4 {
    font-size: 14px;
    font-weight: 600;
    color: #666;
    margin: 0 0 8px 0;
  }

  .mega_section .sub_menu_group ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .mega_section .sub_menu_group li {
    margin-bottom: 3px;
  }

  .mega_section .sub_menu_group a {
    color: #333;
    text-decoration: none;
    font-size: 13px;
    transition: color 0.2s;
    display: block;
    padding: 1px 0;
  }

  .mega_section .sub_menu_group a:hover {
    color: #003cff;
  }

  /* 첫 번째 줄 배치 */
  .mega_section.recruit {
    grid-column: 1;
    grid-row: 1;
  }
  .mega_section.onepick {
    grid-column: 2;
    grid-row: 1;
  }
  .mega_section.gongchae {
    grid-column: 3;
    grid-row: 1;
  }
  .mega_section.headhunting {
    grid-column: 3;
    grid-row: 1;
  }
  /* 두 번째 줄 배치 */
  .mega_section.company {
    grid-column: 4;
    grid-row: 1;
  }
  .mega_section.career {
    grid-column: 5;
    grid-row: 1;
  }
  .mega_section.profile {
    grid-column: 6;
    grid-row: 1;
    background-color: #f0f0f0;
  }

  /* 하단 추가 서비스 영역 */
  .bottom_services {
    grid-column: 1 / -1;
    grid-row: 3;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #f0f0f0;
  }

  .bottom_services h4 {
    font-size: 14px;
    font-weight: 600;
    color: #666;
    margin: 0 0 12px 0;
  }

  .service_links {
    display: flex;
    gap: 30px;
    align-items: center;
  }

  .service_links a {
    color: #333;
    text-decoration: none;
    font-size: 13px;
    transition: color 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .service_links a:hover {
    color: #003cff;
  }

  .service_links .icon {
    width: 16px;
    height: 16px;
    opacity: 0.7;
    display: inline-block;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  .service_links .icon.user {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23666' d='M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z'/%3E%3C/svg%3E");
  }

  .service_links .icon.chat {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23666' d='M2.678 11.894a1 1 0 0 1 .287-1.613A6.97 6.97 0 0 0 8 4c1.996 0 3.675.847 4.678 2.281a1 1 0 1 1-1.356 1.438A4.97 4.97 0 0 0 8 6a4.97 4.97 0 0 0-3.322 1.719 1 1 0 0 1-1.613-.287zM8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1z'/%3E%3C/svg%3E");
  }

  .service_links .icon.chart {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23666' d='M1.5 1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V2.707L.146 3.854a.5.5 0 1 1-.708-.708L1.293 1.293A1 1 0 0 1 2 1h13.5a.5.5 0 0 1 0 1H2zm0 13v-4a.5.5 0 0 1 1 0v3.293l1.854-1.853a.5.5 0 0 1 .708.708L3.207 13.707A1 1 0 0 1 2.5 14H1a.5.5 0 0 1 0-1z'/%3E%3C/svg%3E");
  }

  .service_links .icon.edit {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23666' d='M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L8.5 11.207l-3 1a.5.5 0 0 1-.65-.65l1-3L13.207.854a.5.5 0 0 1 .939 0z'/%3E%3C/svg%3E");
  }

  .service_links .icon.document {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23666' d='M5 4a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zM5 8a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1H5z'/%3E%3C/svg%3E");
  }

  /* 우측 유틸리티 메뉴 */
  .util_menu {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .util_menu a {
    color: #666;
    text-decoration: none;
    font-size: 13px;
    transition: color 0.2s;
  }

  .util_menu a:hover {
    color: #003cff;
  }

  /* 기업서비스 버튼 */
  .util_menu .company_service {
    background: #f5f5f5;
    color: #333;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 12px;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .util_menu .company_service:hover {
    background: #e0e0e0;
  }
`;

export class JkNav extends LitElement {
  static styles = [NAV_STYLES];

  @property({ type: Boolean, reflect: true, attribute: "spa" }) spaMode = false;

  private activeMenu: string | null = null;
  private hoverTimeout: number | null = null;

  private onNavItemEnter = (menuKey: string) => {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }

    this.activeMenu = menuKey;
    this.requestUpdate();
  };

  private onNavItemLeave = () => {
    this.hoverTimeout = window.setTimeout(() => {
      this.activeMenu = null;
      this.requestUpdate();
    }, 100);
  };

  private onMegaMenuEnter = () => {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
  };

  private onMegaMenuLeave = () => {
    this.activeMenu = null;
    this.requestUpdate();
  };

  private handleLinkClick = (ev: Event) => {
    if (this.spaMode) {
      const anchor = ev.target as HTMLAnchorElement;
      if (anchor && anchor.href && anchor.href !== "#") {
        ev.preventDefault();
        ev.stopPropagation(); // 이벤트 버블링 방지
        this.dispatchEvent(
          new CustomEvent("jk:navigate", {
            detail: {
              href: anchor.href,
              text: anchor.textContent?.trim(),
              source: "jk-nav",
            },
            bubbles: true,
            composed: true,
          })
        );
      }
    }
  };

  render() {
    const hasActiveMenu = this.activeMenu !== null;

    return html`
      <nav id="headNavBar" class=${hasActiveMenu ? "open-active" : ""}>
        <ul class="gnb">
          <li
            class="nav_item"
            @mouseenter=${() => this.onNavItemEnter("recruit")}
            @mouseleave=${this.onNavItemLeave}
          >
            <a href="/recruit" @click=${this.handleLinkClick}>채용정보</a>
          </li>

          <li
            class="nav_item onepick"
            @mouseenter=${() => this.onNavItemEnter("onepick")}
            @mouseleave=${this.onNavItemLeave}
          >
            <a href="/onepick" @click=${this.handleLinkClick}>원픽</a>
          </li>

          <li
            class="nav_item"
            @mouseenter=${() => this.onNavItemEnter("aijobs")}
            @mouseleave=${this.onNavItemLeave}
          >
            <a href="/aijobs" @click=${this.handleLinkClick}>AI잡스</a>
          </li>

          <li
            class="nav_item"
            @mouseenter=${() => this.onNavItemEnter("hitech")}
            @mouseleave=${this.onNavItemLeave}
          >
            <a href="/hitech" @click=${this.handleLinkClick}>하이테크</a>
          </li>

          <li
            class="nav_item"
            @mouseenter=${() => this.onNavItemEnter("gongchae")}
            @mouseleave=${this.onNavItemLeave}
          >
            <a href="/gongchae" @click=${this.handleLinkClick}>공채정보</a>
          </li>

          <li
            class="nav_item"
            @mouseenter=${() => this.onNavItemEnter("headhunting")}
            @mouseleave=${this.onNavItemLeave}
          >
            <a href="/headhunting" @click=${this.handleLinkClick}>헤드헌팅</a>
          </li>

          <li
            class="nav_item"
            @mouseenter=${() => this.onNavItemEnter("company")}
            @mouseleave=${this.onNavItemLeave}
          >
            <a href="/company" @click=${this.handleLinkClick}>기업·연봉</a>
          </li>

          <li
            class="nav_item"
            @mouseenter=${() => this.onNavItemEnter("career")}
            @mouseleave=${this.onNavItemLeave}
          >
            <a href="/career" @click=${this.handleLinkClick}>커리어</a>
          </li>

          <!-- 우측 유틸리티 메뉴 -->
          <div class="util_menu">
            <slot name="nav-auth">
              <!-- 기본 인증 UI (slot이 비어있을 때 표시) -->
              <a href="/login" @click=${this.handleLinkClick}>로그인</a>
              <a href="/register" @click=${this.handleLinkClick}>회원가입</a>
            </slot>
            <button class="company_service" type="button">기업서비스</button>
          </div>
        </ul>

        <!-- 메가메뉴 배경 - 모든 섹션 항상 표시 -->
        <div
          class="mega_menu_bg"
          @mouseenter=${this.onMegaMenuEnter}
          @mouseleave=${this.onMegaMenuLeave}
        >
          <div class="mega_menu_container">
            <!-- 첫 번째 줄 -->
            <!-- 채용정보 섹션 -->
            <div
              class="mega_section recruit ${this.activeMenu === "recruit"
                ? "active"
                : ""}"
            >
              <h3>채용정보<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 12l4-4-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg></h3>
              <div class="sub_menu_group">
                <ul>
                  <li><a href="#" @click=${this.handleLinkClick}>지역별</a></li>
                  <li><a href="#" @click=${this.handleLinkClick}>직무별</a></li>
                  <li><a href="#" @click=${this.handleLinkClick}>기업별</a></li>
                  <li><a href="#" @click=${this.handleLinkClick}>산업별</a></li>
                  <li><a href="#" @click=${this.handleLinkClick}>TOP100</a></li>
                  <li>
                    <a href="#" @click=${this.handleLinkClick}>전문채용관</a>
                  </li>
                  <li>
                    <a href="#" @click=${this.handleLinkClick}>슈퍼기업관</a>
                  </li>
                </ul>
              </div>
            </div>

            <!-- 원픽 섹션 -->
            <div
              class="mega_section onepick ${this.activeMenu === "onepick"
                ? "active"
                : ""}"
            >
              <h3>이직은 원픽<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 12l4-4-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg></h3>
              <div class="sub_menu_group">
                <ul>
                  <li>
                    <a href="#" @click=${this.handleLinkClick}
                      >합격축하금 공고</a
                    >
                  </li>
                  <li>
                    <a href="#" @click=${this.handleLinkClick}
                      >원픽서비스 안내</a
                    >
                  </li>
                </ul>
              </div>
            </div>

            <!-- AI잡스 섹션 -->
            <div
              class="mega_section aijobs no-submenu ${this.activeMenu ===
              "aijobs"
                ? "active"
                : ""}"
            >
              <h3>AI잡스<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 12l4-4-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg></h3>
            </div>

            <!-- 하이테크 섹션 -->
            <div
              class="mega_section hitech no-submenu ${this.activeMenu ===
              "hitech"
                ? "active"
                : ""}"
            >
              <h3>하이테크<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 12l4-4-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg></h3>
            </div>

            <!-- 공채정보 섹션 -->
            <div
              class="mega_section gongchae ${this.activeMenu === "gongchae"
                ? "active"
                : ""}"
            >
              <h3>공채정보<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 12l4-4-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg></h3>
              <div class="sub_menu_group">
                <ul>
                  <li>
                    <a href="#" @click=${this.handleLinkClick}
                      >1000대기업 공채</a
                    >
                  </li>
                  <li>
                    <a href="#" @click=${this.handleLinkClick}>공채달력</a>
                  </li>
                  <li>
                    <a href="#" @click=${this.handleLinkClick}
                      >공공기관 채용일정</a
                    >
                  </li>
                </ul>
              </div>

              <!-- 헤드헌팅 섹션 -->
              <div
                class="mega_section headhunting ${this.activeMenu ===
                "headhunting"
                  ? "active"
                  : ""}"
              >
                <h3>헤드헌팅<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 12l4-4-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg></h3>
                <div class="sub_menu_group">
                  <ul>
                    <li>
                      <a href="#" @click=${this.handleLinkClick}
                        >헤드헌팅 채용정보</a
                      >
                    </li>
                    <li>
                      <a href="#" @click=${this.handleLinkClick}
                        >팔로우 헤드헌터</a
                      >
                    </li>
                    <li>
                      <a href="#" @click=${this.handleLinkClick}
                        >헤드헌터 찾기</a
                      >
                    </li>
                    <li>
                      <a href="#" @click=${this.handleLinkClick}>채용 상담</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- 두 번째 줄 -->
            <!-- 기업·연봉 섹션 -->
            <div
              class="mega_section company ${this.activeMenu === "company"
                ? "active"
                : ""}"
            >
              <h3>기업·연봉<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 12l4-4-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg></h3>
              <div class="sub_menu_group">
                <ul>
                  <li>
                    <a href="#" @click=${this.handleLinkClick}>기업리뷰</a>
                  </li>
                  <li><a href="#" @click=${this.handleLinkClick}>연봉</a></li>
                  <li>
                    <a href="#" @click=${this.handleLinkClick}
                      >기업분석보고서</a
                    >
                  </li>
                </ul>
              </div>
            </div>

            <!-- 커리어 섹션 (넓게) -->
            <div
              class="mega_section career ${this.activeMenu === "career"
                ? "active"
                : ""}"
            >
              <h3>커리어<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 12l4-4-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg></h3>
              <div class="sub_menu_group">
                <ul>
                  <li>
                    <a href="#" @click=${this.handleLinkClick}>콘텐츠LAB</a>
                  </li>
                  <li>
                    <a href="#" @click=${this.handleLinkClick}>합격자소서</a>
                  </li>
                  <li>
                    <a href="#" @click=${this.handleLinkClick}
                      >인적성 면접 후기</a
                    >
                  </li>
                  <li>
                    <a href="#" @click=${this.handleLinkClick}>인성역량검사</a>
                  </li>
                  <li>
                    <a href="#" @click=${this.handleLinkClick}
                      >공기업 모의고사</a
                    >
                  </li>
                  <li>
                    <a href="#" @click=${this.handleLinkClick}>직무인터뷰</a>
                  </li>
                  <li>
                    <a href="#" @click=${this.handleLinkClick}
                      >역량테스트(MICT)</a
                    >
                  </li>
                  <li>
                    <a href="#" @click=${this.handleLinkClick}>취업TOOL</a>
                  </li>
                  <li>
                    <a href="#" @click=${this.handleLinkClick}>문서서식자료</a>
                  </li>
                </ul>
              </div>
            </div>

            <!-- 취업톡톡 섹션 -->
            <div
              class="mega_section jobtalk ${this.activeMenu === "jobtalk"
                ? "active"
                : ""}"
            >
              <h3>취업톡톡<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 12l4-4-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg></h3>
              <div class="sub_menu_group">
                <ul>
                  <li>
                    <a href="#" @click=${this.handleLinkClick}>질문하기</a>
                  </li>
                  <li>
                    <a href="#" @click=${this.handleLinkClick}>답변하기</a>
                  </li>
                  <li>
                    <a href="#" @click=${this.handleLinkClick}>인기질문</a>
                  </li>
                </ul>
              </div>
            </div>

            <!-- 프로필 등록 섹션 -->
            <div class="mega_section profile">
              <h3>
                프로필 등록하고<br />포지션 제안 받으세요<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 12l4-4-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </h3>
              <div class="sub_menu_group">
                <ul>
                  <li>
                    <a href="#" @click=${this.handleLinkClick}>개인회원 홈</a>
                  </li>
                  <li>
                    <a href="#" @click=${this.handleLinkClick}>이력서 관리</a>
                  </li>
                  <li>
                    <a href="#" @click=${this.handleLinkClick}>포지션 제안</a>
                  </li>
                  <li>
                    <a href="#" @click=${this.handleLinkClick}>스크랩 공고</a>
                  </li>
                  <li>
                    <a href="#" @click=${this.handleLinkClick}>개인정보 수정</a>
                  </li>
                </ul>
              </div>
            </div>

            <!-- 하단 추가 서비스 -->
            <div class="bottom_services">
              <h4>추천 서비스</h4>
              <div class="service_links">
                <a href="#" @click=${this.handleLinkClick}>
                  <span class="icon user"></span>
                  직무인터뷰
                </a>
                <a href="#" @click=${this.handleLinkClick}>
                  <span class="icon chat"></span>
                  인적성면접후기
                </a>
                <a href="#" @click=${this.handleLinkClick}>
                  <span class="icon chart"></span>
                  일간채용 TOP100
                </a>
                <a href="#" @click=${this.handleLinkClick}>
                  <span class="icon edit"></span>
                  글자수세기
                </a>
                <a href="#" @click=${this.handleLinkClick}>
                  <span class="icon document"></span>
                  학점계산기
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "jk-nav": JkNav;
  }
}

if (!customElements.get("jk-nav")) {
  customElements.define("jk-nav", JkNav);
}
