import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

interface MenuItem {
  id: string;
  menuId: string;
  menuName: string;
  useGA: boolean;
  ga?: {
    area: string;
    label: string;
    page: string;
  };
  useLink: boolean;
  linkProps: {
    href: string;
    target: "_blank" | "_self" | "_top" | "_parent";
  };
  useTypography: boolean;
  typographyProps: any;
  layoutProps: any;
  useLeftIcon: boolean;
  leftIconProps?: {
    name: string;
    size: string;
    marginRight?: string;
  };
  useRightIcon: boolean;
  rightIconProps?: {
    name: string;
    size: string;
    marginLeft?: string;
  };
  useImage: boolean;
  imageProps?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
}

interface SectionItem {
  id: string;
  gridArea: string;
  menuList: MenuItem[];
  flexDirection: string;
  gapX?: string;
  gapY?: string;
  layoutProps: any;
  flexWrap?: string;
  flexAlign?: string;
  flexJustify?: string;
  backgroundColor?: string;
}

interface HeaderJson {
  sectionList: SectionItem[];
  gridTemplateColumns: number[];
  gridTemplateAreas: string[][];
  totalWidth: number;
  totalHeight: number;
}

@customElement("jk-total-menu")
export class JkTotalMenu extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: "Pretendard", sans-serif;
      outline: none;

      /* JDS properties */
      --jds-space-space4: 4px;
      --jds-space-space6: 6px;
      --jds-space-space8: 8px;
      --jds-space-space12: 12px;
      --jds-space-space16: 16px;
      --jds-space-space20: 20px;
      --jds-space-space24: 24px;

      --jds-color-base-white: #ffffff;
      --jds-color-gray-gray50: #f8f9fa;
      --jds-color-gray-gray200: #e9ecef;
      --jds-color-gray700: #495057;
      --jds-color-gray900: #212529;

      --jds-typography-size14: 14px;
      --jds-typography-size16: 16px;
      --jds-typography-weight-regular: 400;
      --jds-typography-weight-medium: 500;
      --jds-typography-weight-bold: 700;
    }

    .header-grid {
      background-color: white;
      display: grid;
      width: 100%;
      box-sizing: border-box;
    }

    .section {
      display: inline-flex;
      width: 100%;
      box-sizing: border-box;
      align-items: center;
    }

    .menu-item {
      display: inline-flex;
      text-decoration: none;
      color: inherit;
      cursor: pointer;
      transition: opacity 0.2s ease;
      box-sizing: border-box;
    }

    .menu-item:hover {
      opacity: 0.8;
    }

    .menu-item:focus {
      outline: 2px solid #007bff;
      outline-offset: 2px;
    }

    .menu-content {
      display: inline-flex;
      align-items: center;
      box-sizing: border-box;
    }

    .menu-text {
      white-space: pre-line;
      font-size: inherit;
      font-weight: inherit;
      color: inherit;
      line-height: inherit;
    }

    .menu-image {
      display: block;
      max-width: 100%;
      height: auto;
      object-fit: contain;
    }

    .icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .icon svg {
      width: 1em;
      height: 1em;
      fill: currentColor;
      flex-shrink: 0;
    }

    .icon-fallback {
      font-size: 0.8em;
      opacity: 0.6;
      font-style: italic;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .header-grid {
        grid-template-columns: 1fr !important;
        grid-template-areas: none !important;
      }

      .section {
        flex-wrap: wrap;
        justify-content: center;
      }

      .menu-item {
        margin: 4px;
      }
    }

    /* Accessibility improvements */
    @media (prefers-reduced-motion: reduce) {
      .menu-item {
        transition: none;
      }
    }

    @media (prefers-contrast: high) {
      .menu-item:focus {
        outline-width: 3px;
        outline-style: solid;
      }
    }

    /* Print styles */
    @media print {
      .menu-item {
        color: black !important;
        text-decoration: underline;
      }

      .menu-item::after {
        content: " (" attr(href) ")";
        font-size: 0.8em;
        color: #666;
      }
    }
  `;

  @property({ type: Object })
  headerJson!: HeaderJson;

  @property({ type: Object, attribute: "slot-data" })
  slotData?: Record<
    string,
    { onClick?: () => void; style?: Record<string, string> }
  >;

  @property({ type: Function })
  gaClick?: (ga: MenuItem["ga"]) => void;

  private handleMenuClick(menu: MenuItem, slotHandler?: () => void) {
    return (e: Event) => {
      if (menu.useGA && this.gaClick) {
        this.gaClick(menu.ga);
      }
      if (slotHandler) {
        slotHandler();
      }
    };
  }

  private generateLayoutStyles(layoutProps: any): string {
    if (!layoutProps) return "";

    const styles: string[] = [];

    // Padding
    if (layoutProps.paddingTop)
      styles.push(`padding-top: var(--jds-space-${layoutProps.paddingTop})`);
    if (layoutProps.paddingBottom)
      styles.push(
        `padding-bottom: var(--jds-space-${layoutProps.paddingBottom})`
      );
    if (layoutProps.paddingLeft)
      styles.push(`padding-left: var(--jds-space-${layoutProps.paddingLeft})`);
    if (layoutProps.paddingRight)
      styles.push(
        `padding-right: var(--jds-space-${layoutProps.paddingRight})`
      );

    // Margin
    if (layoutProps.marginTop)
      styles.push(`margin-top: var(--jds-space-${layoutProps.marginTop})`);
    if (layoutProps.marginBottom)
      styles.push(
        `margin-bottom: var(--jds-space-${layoutProps.marginBottom})`
      );
    if (layoutProps.marginLeft)
      styles.push(`margin-left: var(--jds-space-${layoutProps.marginLeft})`);
    if (layoutProps.marginRight)
      styles.push(`margin-right: var(--jds-space-${layoutProps.marginRight})`);

    // Borders
    if (layoutProps.borderTop) {
      const border = layoutProps.borderTop;
      styles.push(
        `border-top: ${border.size}px solid var(--jds-color-${border.color})`
      );
    }
    if (layoutProps.borderBottom) {
      const border = layoutProps.borderBottom;
      styles.push(
        `border-bottom: ${border.size}px solid var(--jds-color-${border.color})`
      );
    }
    if (layoutProps.borderLeft) {
      const border = layoutProps.borderLeft;
      styles.push(
        `border-left: ${border.size}px solid var(--jds-color-${border.color})`
      );
    }
    if (layoutProps.borderRight) {
      const border = layoutProps.borderRight;
      styles.push(
        `border-right: ${border.size}px solid var(--jds-color-${border.color})`
      );
    }

    return styles.join("; ");
  }

  private generateTypographyStyles(typographyProps: any): string {
    if (!typographyProps) return "";

    const styles: string[] = [];

    if (typographyProps.variant) {
      styles.push(
        `font-size: var(--jds-typography-${typographyProps.variant})`
      );
    }
    if (typographyProps.weight) {
      styles.push(
        `font-weight: var(--jds-typography-weight-${typographyProps.weight})`
      );
    }
    if (typographyProps.color) {
      styles.push(`color: var(--jds-color-${typographyProps.color})`);
    }
    if (typographyProps.underline) {
      styles.push(`text-decoration: underline`);
    }

    return styles.join("; ");
  }

  private renderIcon(iconName: string) {
    const iconMap = {
      'arrow-right': html`<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 12l4-4-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      'headset': html`<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 11v3a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1zM14 11v3a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1zM8 1a7 7 0 0 1 7 7v2h-2V8a5 5 0 0 0-10 0v2H1V8a7 7 0 0 1 7-7z" fill="currentColor"/></svg>`,
      'loudspeaker': html`<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M9 4v12l-4-4H2V8h3l4-4zm2 0.4c1.2.8 2 2.2 2 3.6s-.8 2.8-2 3.6v-7.2zm0 10.4c2.6-1.8 4-4.8 4-8s-1.4-6.2-4-8v16z" fill="currentColor"/></svg>`,
      'event': html`<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M14 2v2h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2V2h2v2h6V2h2zM4 8v10h12V8H4zm2 2h2v2H6v-2zm0 4h2v2H6v-2zm4-4h2v2h-2v-2z" fill="currentColor"/></svg>`,
      'onepick': html`<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" fill="#1565c0"/><path d="M7 10l2.5 2.5L15 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      'buy-opt': html`<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v4a2 2 0 1 0 4 0v-4m6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>`,
      'company-option': html`<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4h4v4H4V4zm0 6h4v6H4v-6zm6-6h6v4h-6V4zm2 6h4v6h-4v-6z" fill="currentColor"/></svg>`,
      'lawintro': html`<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2L3 7v11h14V7l-7-5zM8 16H6v-4h2v4zm4 0h-2v-4h2v4zm4 0h-2v-4h2v4z" fill="currentColor"/></svg>`,
      'jat': html`<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2a8 8 0 1 0 8 8 8 8 0 0 0-8-8zm0 14a6 6 0 1 1 6-6 6 6 0 0 1-6 6zm1-9h-2v6h2V7zm0 8h-2v2h2v-2z" fill="currentColor"/></svg>`,
      'oras': html`<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 4v12h16V4H2zm2 2h12v8H4V6zm2 2v4h8V8H6z" fill="currentColor"/></svg>`
    };
    
    return iconMap[iconName] || html`<span class="icon-fallback">${iconName}</span>`;
  }

  private renderMenuItem(menu: MenuItem) {
    const slotHandlerData = this.slotData?.[menu.menuId];
    const clickHandler = this.handleMenuClick(menu, slotHandlerData?.onClick);

    const menuContent = html`
      <div class="menu-content">
        ${menu.useLeftIcon && menu.leftIconProps
          ? html`<span
              class="icon"
              style="margin-right: ${menu.leftIconProps.marginRight === 'space4' ? 'var(--jds-space-space4)' : (menu.leftIconProps.marginRight || "0")}"
            >
              ${this.renderIcon(menu.leftIconProps.name)}
            </span>`
          : ""}
        ${menu.useImage && menu.imageProps
          ? html`<img
              class="menu-image"
              src="${menu.imageProps.src}"
              alt="${menu.imageProps.alt}"
              width="${menu.imageProps.width}"
              height="${menu.imageProps.height}"
            />`
          : html`<span class="menu-text">${menu.menuName}</span>`}
        ${menu.useRightIcon && menu.rightIconProps
          ? html`<span
              class="icon"
              style="margin-left: ${menu.rightIconProps.marginLeft === 'space4' ? 'var(--jds-space-space4)' : (menu.rightIconProps.marginLeft || "0")}"
            >
              ${this.renderIcon(menu.rightIconProps.name)}
            </span>`
          : ""}
      </div>
    `;

    if (menu.useLink) {
      return html`
        <a
          class="menu-item"
          href="${menu.linkProps.href}"
          target="${menu.linkProps.target}"
          style="${[
            slotHandlerData?.style
              ? Object.entries(slotHandlerData.style)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join("; ")
              : "",
            this.generateLayoutStyles(menu.layoutProps),
            this.generateTypographyStyles(menu.typographyProps),
          ]
            .filter(Boolean)
            .join("; ")}"
          @click=${clickHandler}
          data-url="${menu.linkProps.href}"
          data-menu-id="${menu.menuId}"
          data-menu-name="${menu.menuName}"
        >
          ${menuContent}
        </a>
      `;
    }

    return html`
      <span
        class="menu-item"
        style="${[
          slotHandlerData?.style
            ? Object.entries(slotHandlerData.style)
                .map(([k, v]) => `${k}: ${v}`)
                .join("; ")
            : "",
          this.generateLayoutStyles(menu.layoutProps),
          this.generateTypographyStyles(menu.typographyProps),
        ]
          .filter(Boolean)
          .join("; ")}"
        @click=${clickHandler}
      >
        ${menuContent}
      </span>
    `;
  }

  private renderSection(section: SectionItem) {
    const sectionStyle = [
      `grid-area: ${section.gridArea}`,
      `flex-direction: ${section.flexDirection}`,
      section.gapX && section.gapX !== "space0"
        ? `gap: var(--jds-space-${section.gapX}) 0`
        : "",
      section.gapY && section.gapY !== "space0"
        ? `gap: 0 var(--jds-space-${section.gapY})`
        : "",
      section.flexWrap && section.flexWrap !== "initial"
        ? `flex-wrap: ${section.flexWrap}`
        : "",
      section.flexAlign && section.flexAlign !== "initial"
        ? `align-items: ${section.flexAlign}`
        : "",
      section.flexJustify && section.flexJustify !== "initial"
        ? `justify-content: ${section.flexJustify}`
        : "",
      section.backgroundColor
        ? `background-color: var(--jds-color-${section.backgroundColor})`
        : "",
      this.generateLayoutStyles(section.layoutProps),
    ]
      .filter(Boolean)
      .join("; ");

    return html`
      <div class="section" style="${sectionStyle}">
        ${section.menuList.map((menu) => this.renderMenuItem(menu))}
      </div>
    `;
  }

  render() {
    if (!this.headerJson) return html``;

    const gridTemplateAreas = this.headerJson.gridTemplateAreas
      .map((area) => `"${area.join(" ")}"`)
      .join("\n");
    const gridTemplateColumns = this.headerJson.gridTemplateColumns
      .map((column) => `${column}px`)
      .join(" ");

    const gridStyle = [
      `grid-template-areas: ${gridTemplateAreas}`,
      `grid-template-columns: ${gridTemplateColumns}`,
      `height: ${this.headerJson.totalHeight}px`,
      `width: ${this.headerJson.totalWidth}px`,
    ].join("; ");

    return html`
      <div class="header-grid" style="${gridStyle}">
        ${this.headerJson.sectionList.map((section) =>
          this.renderSection(section)
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "jk-total-menu": JkTotalMenu;
  }
}
