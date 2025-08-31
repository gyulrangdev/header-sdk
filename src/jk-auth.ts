import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

interface User {
  id: string;
  name: string;
  email: string;
  type: "personal" | "company";
}

@customElement("jk-auth")
export class JkAuth extends LitElement {
  static styles = css`
    :host {
      display: flex;
      align-items: center;
      gap: 8px;
      position: relative;
    }

    .auth-container {
      position: relative;
      transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .user-info, .auth-links {
      transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .visible {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

    .hidden {
      opacity: 0;
      transform: translateY(-5px);
      pointer-events: none;
      position: absolute;
      top: 0;
      left: 0;
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
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .auth-links a:hover {
      color: #003cff;
    }

    .company-btn {
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

    .company-btn:hover {
      background: #e0e0e0;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-name {
      color: #333;
      font-size: 13px;
      font-weight: 500;
    }

    .user-menu {
      position: relative;
      display: inline-block;
    }

    .user-menu-btn {
      background: none;
      border: none;
      color: #666;
      cursor: pointer;
      font-size: 13px;
      padding: 4px 8px;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .user-menu-btn:hover {
      background: #f5f5f5;
    }

    .user-menu-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      min-width: 120px;
      z-index: 1000;
      display: none;
    }

    .user-menu-dropdown.open {
      display: block;
    }

    .user-menu-dropdown a {
      display: block;
      padding: 8px 12px;
      color: #333;
      text-decoration: none;
      font-size: 13px;
      border-bottom: 1px solid #f0f0f0;
    }

    .user-menu-dropdown a:last-child {
      border-bottom: none;
    }

    .user-menu-dropdown a:hover {
      background: #f8f9fa;
    }

    .logout-btn {
      color: #dc3545 !important;
    }
  `;

  @property({ type: Object }) user?: User;
  @property({ type: String, attribute: "user" }) userAttr?: string;
  @property({ type: Boolean, reflect: true, attribute: "spa" }) spaMode = false;
  @property({ type: Boolean, reflect: true, attribute: "logged-in" }) loggedIn = false;
  @property({ type: Boolean }) showUserMenu = false;

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

  private handleUserMenuToggle = () => {
    this.showUserMenu = !this.showUserMenu;
  };

  private handleLogout = (ev: Event) => {
    ev.preventDefault();
    this.dispatchEvent(
      new CustomEvent("jk:auth", {
        detail: { action: "logout" },
        bubbles: true,
        composed: true,
      })
    );
    this.showUserMenu = false;
  };

  private handleLogin = (ev: Event) => {
    if (this.spaMode) {
      ev.preventDefault();
      this.dispatchEvent(
        new CustomEvent("jk:auth", {
          detail: { action: "login" },
          bubbles: true,
          composed: true,
        })
      );
    }
  };

  private handleRegister = (ev: Event) => {
    if (this.spaMode) {
      ev.preventDefault();
      this.dispatchEvent(
        new CustomEvent("jk:auth", {
          detail: { action: "register" },
          bubbles: true,
          composed: true,
        })
      );
    }
  };

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("click", this.handleOutsideClick);
    // 초기 user 파싱
    if (this.userAttr) {
      this.user = this.parseUser(this.userAttr);
    }
  }

  protected willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("userAttr")) {
      this.user = this.parseUser(this.userAttr);
    }
  }

  private parseUser(value?: string): User | undefined {
    if (!value) return undefined;
    try {
      const obj = JSON.parse(value);
      return obj ?? undefined;
    } catch {
      console.warn("Invalid user JSON:", value);
      return undefined;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this.handleOutsideClick);
  }

  private handleOutsideClick = (ev: Event) => {
    if (!this.contains(ev.target as Node)) {
      this.showUserMenu = false;
    }
  };

  render() {
    const isLoggedIn = this.loggedIn && this.user;
    
    return html`
      <div class="auth-container ${isLoggedIn ? 'show-user' : 'show-auth'}">
        <div class="user-info ${isLoggedIn ? 'visible' : 'hidden'}">
          <span class="user-name">${this.user?.name || ''}</span>
          <div class="user-menu">
            <button
              class="user-menu-btn"
              @click=${this.handleUserMenuToggle}
              aria-expanded=${this.showUserMenu}
              aria-haspopup="true"
            >
              마이페이지
            </button>
            <div class="user-menu-dropdown ${this.showUserMenu ? "open" : ""}">
              <a href="/mypage" @click=${this.handleLinkClick}>마이페이지</a>
              <a href="/resume" @click=${this.handleLinkClick}>내 이력서</a>
            </div>
          </div>
        </div>
        
        <div class="auth-links ${!isLoggedIn ? 'visible' : 'hidden'}">
          <a href="/login" @click=${this.handleLogin}>로그인</a>
          <a href="/register" @click=${this.handleRegister}>회원가입</a>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "jk-auth": JkAuth;
  }
}
