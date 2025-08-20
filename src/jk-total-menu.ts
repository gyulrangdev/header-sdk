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
      
      /* CSS Custom Properties for Design System */
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
    if (layoutProps.paddingTop) styles.push(`padding-top: var(--jds-space-${layoutProps.paddingTop})`);
    if (layoutProps.paddingBottom) styles.push(`padding-bottom: var(--jds-space-${layoutProps.paddingBottom})`);
    if (layoutProps.paddingLeft) styles.push(`padding-left: var(--jds-space-${layoutProps.paddingLeft})`);
    if (layoutProps.paddingRight) styles.push(`padding-right: var(--jds-space-${layoutProps.paddingRight})`);
    
    // Margin
    if (layoutProps.marginTop) styles.push(`margin-top: var(--jds-space-${layoutProps.marginTop})`);
    if (layoutProps.marginBottom) styles.push(`margin-bottom: var(--jds-space-${layoutProps.marginBottom})`);
    if (layoutProps.marginLeft) styles.push(`margin-left: var(--jds-space-${layoutProps.marginLeft})`);
    if (layoutProps.marginRight) styles.push(`margin-right: var(--jds-space-${layoutProps.marginRight})`);
    
    // Borders
    if (layoutProps.borderTop) {
      const border = layoutProps.borderTop;
      styles.push(`border-top: ${border.size}px solid var(--jds-color-${border.color})`);
    }
    if (layoutProps.borderBottom) {
      const border = layoutProps.borderBottom;
      styles.push(`border-bottom: ${border.size}px solid var(--jds-color-${border.color})`);
    }
    if (layoutProps.borderLeft) {
      const border = layoutProps.borderLeft;
      styles.push(`border-left: ${border.size}px solid var(--jds-color-${border.color})`);
    }
    if (layoutProps.borderRight) {
      const border = layoutProps.borderRight;
      styles.push(`border-right: ${border.size}px solid var(--jds-color-${border.color})`);
    }
    
    return styles.join("; ");
  }

  private generateTypographyStyles(typographyProps: any): string {
    if (!typographyProps) return "";
    
    const styles: string[] = [];
    
    if (typographyProps.variant) {
      styles.push(`font-size: var(--jds-typography-${typographyProps.variant})`);
    }
    if (typographyProps.weight) {
      styles.push(`font-weight: var(--jds-typography-weight-${typographyProps.weight})`);
    }
    if (typographyProps.color) {
      styles.push(`color: var(--jds-color-${typographyProps.color})`);
    }
    if (typographyProps.underline) {
      styles.push(`text-decoration: underline`);
    }
    
    return styles.join("; ");
  }

  private renderMenuItem(menu: MenuItem) {
    const slotHandlerData = this.slotData?.[menu.menuId];
    const clickHandler = this.handleMenuClick(menu, slotHandlerData?.onClick);

    const menuContent = html`
      <div class="menu-content">
        ${menu.useLeftIcon && menu.leftIconProps
          ? html`<span
              class="icon"
              style="margin-right: ${menu.leftIconProps.marginRight || "0"}"
            >
              ${menu.leftIconProps.name === "arrow-right"
                ? html`→`
                : html`<span>${menu.leftIconProps.name}</span>`}
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
              style="margin-left: ${menu.rightIconProps.marginLeft || "0"}"
            >
              ${menu.rightIconProps.name === "arrow-right"
                ? html`→`
                : html`<span>${menu.rightIconProps.name}</span>`}
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
            this.generateTypographyStyles(menu.typographyProps)
          ].filter(Boolean).join("; ")}"
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
          this.generateTypographyStyles(menu.typographyProps)
        ].filter(Boolean).join("; ")}"
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
      this.generateLayoutStyles(section.layoutProps)
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
