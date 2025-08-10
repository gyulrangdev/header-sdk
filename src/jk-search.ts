import { LitElement, css, html } from "lit";
import { property } from "lit/decorators.js";

const SEARCH_STYLES = css`
  :host {
    display: block;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, sans-serif;
    font-size: 13px;
  }

  /* 검색 영역 전체 */
  #searchWrap {
    position: relative;
    width: 100%;
    max-width: 500px;
  }

  /* 검색 폼 */
  .search_form {
    position: relative;
    display: flex;
    align-items: center;
    background: #fff;
    border: 2px solid #1565c0;
    border-radius: 4px;
    height: 48px;
    overflow: hidden;
  }

  /* 검색 입력창 */
  .search_form input[type="text"] {
    flex: 1;
    height: 100%;
    border: none;
    outline: none;
    padding: 0 50px 0 16px;
    font-size: 16px;
    background: transparent;
    color: #333;
    font-family: inherit;
  }

  .search_form input[type="text"]::placeholder {
    color: #999;
    font-size: 16px;
  }

  /* 검색 버튼 */
  .search_btn {
    position: absolute;
    right: 0;
    top: 0;
    width: 48px;
    height: 48px;
    background: #1565c0;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }

  .search_btn:hover {
    background: #0d47a1;
  }

  .search_btn::before {
    content: "";
    width: 16px;
    height: 16px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
  }

  /* 자동완성 리스트 */
  .searchList {
    position: absolute;
    top: calc(100% + 2px);
    left: 0;
    right: 0;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
    padding: 8px 0;
  }

  .searchList li {
    padding: 12px 16px;
    cursor: pointer;
    font-size: 14px;
    color: #333;
    transition: background-color 0.2s;
  }

  .searchList li:hover {
    background-color: #f5f5f5;
  }

  /* 추천 검색어 섹션 */
  .suggestion_section {
    border-bottom: 1px solid #eee;
    padding-bottom: 8px;
    margin-bottom: 8px;
  }

  .suggestion_title {
    padding: 8px 16px 4px;
    font-size: 12px;
    color: #666;
    font-weight: 500;
  }

  /* 최근 검색어 */
  .recent_searches {
    padding-top: 8px;
  }

  .recent_title {
    padding: 4px 16px 8px;
    font-size: 12px;
    color: #666;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .clear_recent {
    color: #999;
    font-size: 11px;
    cursor: pointer;
  }

  .clear_recent:hover {
    color: #1565c0;
  }
`;

export class JkSearch extends LitElement {
  static styles = [SEARCH_STYLES];

  @property({ type: String }) placeholder =
    "키워드를 입력하시면\n검색어를 추천해드립니다.";
  @property({ type: Boolean, reflect: true, attribute: "spa" }) spaMode = false;

  private searchQuery: string = "";
  private suggestions: string[] = [
    "잡코리아 AI 챌린지",
    "개발자",
    "디자이너",
    "마케팅",
    "영업",
    "기획",
    "서울",
    "경기",
    "부산",
    "대구",
    "신입",
    "경력",
    "인턴",
    "정규직",
    "계약직",
  ];
  private recentSearches: string[] = [
    "개발자 채용",
    "마케팅 신입",
    "서울 기획자",
  ];
  private filteredSuggestions: string[] = [];
  private showAutocomplete = false;

  private onSearchInput = (ev: Event) => {
    const input = ev.target as HTMLInputElement;
    this.searchQuery = input.value;

    if (this.searchQuery.trim()) {
      this.filteredSuggestions = this.suggestions
        .filter((s) => s.toLowerCase().includes(this.searchQuery.toLowerCase()))
        .slice(0, 6);
      this.showAutocomplete = true;
    } else {
      this.showAutocomplete = this.recentSearches.length > 0;
    }
    this.requestUpdate();
  };

  private onSearchFocus = () => {
    if (this.searchQuery.trim()) {
      if (this.filteredSuggestions.length > 0) {
        this.showAutocomplete = true;
      }
    } else {
      this.showAutocomplete = this.recentSearches.length > 0;
    }
    this.requestUpdate();
  };

  private onSearchBlur = () => {
    setTimeout(() => {
      this.showAutocomplete = false;
      this.requestUpdate();
    }, 150);
  };

  private onSuggestionClick = (suggestion: string) => {
    this.searchQuery = suggestion;
    this.showAutocomplete = false;

    // 최근 검색어에 추가
    if (!this.recentSearches.includes(suggestion)) {
      this.recentSearches.unshift(suggestion);
      if (this.recentSearches.length > 5) {
        this.recentSearches.pop();
      }
    }

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

      // 최근 검색어에 추가
      if (!this.recentSearches.includes(this.searchQuery)) {
        this.recentSearches.unshift(this.searchQuery);
        if (this.recentSearches.length > 5) {
          this.recentSearches.pop();
        }
      }

      this.dispatchEvent(
        new CustomEvent("jk:search", {
          detail: { query: this.searchQuery },
          bubbles: true,
          composed: true,
        })
      );
    }
  };

  private clearRecentSearches = () => {
    this.recentSearches = [];
    this.requestUpdate();
  };

  render() {
    return html`
      <div id="searchWrap">
        <form class="search_form" @submit=${this.onSearchSubmit}>
          <input
            type="text"
            placeholder=${this.placeholder}
            .value=${this.searchQuery}
            @input=${this.onSearchInput}
            @focus=${this.onSearchFocus}
            @blur=${this.onSearchBlur}
            aria-label="통합검색"
          />
          <button type="submit" class="search_btn" aria-label="검색"></button>
        </form>

        <!-- 자동완성 리스트 -->
        <div class="searchList ${this.showAutocomplete ? "show" : ""}">
          <ul>
            ${this.searchQuery.trim()
              ? html`
                  <div class="suggestion_section">
                    <div class="suggestion_title">검색어 추천</div>
                    ${this.filteredSuggestions.map(
                      (suggestion) => html`
                        <li
                          @mousedown=${() => this.onSuggestionClick(suggestion)}
                        >
                          ${suggestion}
                        </li>
                      `
                    )}
                  </div>
                `
              : html`
                  <div class="recent_searches">
                    <div class="recent_title">
                      <span>최근 검색어</span>
                      <span
                        class="clear_recent"
                        @click=${this.clearRecentSearches}
                        >전체삭제</span
                      >
                    </div>
                    ${this.recentSearches.map(
                      (recent) => html`
                        <li @mousedown=${() => this.onSuggestionClick(recent)}>
                          ${recent}
                        </li>
                      `
                    )}
                  </div>
                `}
          </ul>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "jk-search": JkSearch;
  }
}

if (!customElements.get("jk-search")) {
  customElements.define("jk-search", JkSearch);
}
