import { LitElement, css, html } from "lit";
import { property } from "lit/decorators.js";
import { getV1KeywordsAutocompletes, validateSearchKeyword, debounce } from "./api/auto-complete.api.js";
import type { AutoCompleteKeyword, DirectKeyword } from "./api/types.js";

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
    border: 2px solid #003cff;
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
    background: #fff;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }

  .search_btn:hover {
    background: #003cff;
  }

  .search_btn::before {
    content: "";
    width: 16px;
    height: 16px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='blue' viewBox='0 0 24 24'%3E%3Cpath d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3C/svg%3E");
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
  private autoCompleteData: AutoCompleteKeyword[] = [];
  private directData: DirectKeyword[] = [];
  private recentSearches: string[] = [
    "개발자 채용",
    "마케팅 신입",
    "서울 기획자",
  ];
  private showAutocomplete = false;
  private isLoading = false;
  private autoCompleteEnabled = true;

  private debouncedAutoComplete = debounce(async (keyword: string) => {
    console.log('🔍 Auto complete triggered for keyword:', keyword);
    
    if (!keyword.trim() || !validateSearchKeyword(keyword) || !this.autoCompleteEnabled) {
      console.log('❌ Validation failed or auto complete disabled');
      this.autoCompleteData = [];
      this.directData = [];
      this.isLoading = false;
      this.requestUpdate();
      return;
    }

    this.isLoading = true;
    this.requestUpdate();
    console.log('⏳ Loading started...');

    try {
      console.log('🌐 Calling API for keyword:', keyword);
      const response = await getV1KeywordsAutocompletes(keyword, 10);
      console.log('✅ API Response:', response);
      this.autoCompleteData = response.autoComplete;
      this.directData = response.direct;
    } catch (error) {
      console.error('❌ Auto complete error:', error);
      this.autoCompleteData = [];
      this.directData = [];
    }

    this.isLoading = false;
    this.requestUpdate();
    console.log('✅ Loading finished');
  }, 100);

  private onSearchInput = (ev: Event) => {
    const input = ev.target as HTMLInputElement;
    this.searchQuery = input.value;

    if (this.searchQuery.trim()) {
      this.showAutocomplete = true;
      this.debouncedAutoComplete(this.searchQuery);
    } else {
      this.showAutocomplete = this.recentSearches.length > 0;
      this.autoCompleteData = [];
      this.directData = [];
    }
    this.requestUpdate();
  };

  private onSearchFocus = () => {
    if (this.searchQuery.trim()) {
      if (this.autoCompleteData.length > 0 || this.directData.length > 0) {
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

  private onDirectClick = (item: DirectKeyword) => {
    if (item.linkUrl) {
      if (this.spaMode) {
        this.dispatchEvent(
          new CustomEvent("jk:navigate", {
            detail: { url: item.linkUrl },
            bubbles: true,
            composed: true,
          })
        );
      } else {
        window.location.href = item.linkUrl;
      }
    }
    this.showAutocomplete = false;
    this.requestUpdate();
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
                  ${this.isLoading
                    ? html`<li>검색 중...</li>`
                    : html`
                        ${this.autoCompleteData.length > 0
                          ? html`
                              <div class="suggestion_section">
                                <div class="suggestion_title">검색어 추천</div>
                                ${this.autoCompleteData.map(
                                  (item) => html`
                                    <li
                                      @mousedown=${() => this.onSuggestionClick(item.keyword)}
                                      title="${item.featureName || item.featureCode}"
                                    >
                                      ${item.keyword}
                                      ${item.featureName 
                                        ? html`<span style="color: #666; font-size: 12px; margin-left: 8px;">${item.featureName}</span>`
                                        : ''}
                                    </li>
                                  `
                                )}
                              </div>
                            `
                          : ''}
                        ${this.directData.length > 0
                          ? html`
                              <div class="suggestion_section">
                                <div class="suggestion_title">바로가기</div>
                                ${this.directData.map(
                                  (item) => html`
                                    <li
                                      @mousedown=${() => this.onDirectClick(item)}
                                      style="color: #003cff;"
                                    >
                                      ${item.content}
                                    </li>
                                  `
                                )}
                              </div>
                            `
                          : ''}
                      `}
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
