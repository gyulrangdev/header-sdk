import { LitElement, css, html } from "lit";
import { property } from "lit/decorators.js";

const ICON_STYLES = css`
  :host {
    display: inline-block;
    width: var(--icon-size, 16px);
    height: var(--icon-size, 16px);
  }

  svg {
    width: 100%;
    height: 100%;
    stroke: var(--icon-color, currentColor);
    stroke-width: var(--icon-stroke-width, 2);
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
  }
`;

export class JkIcon extends LitElement {
  static styles = [ICON_STYLES];

  @property({ type: String, reflect: true }) name: string = "";
  @property({ type: String, reflect: true }) size: string = "16px";
  @property({ type: String, reflect: true }) color: string = "currentColor";

  private getIconPath(name: string) {
    const icons: Record<string, string> = {
      "chevron-right": "M9 18l6-6-6-6",
      "arrow-right": "M5 12h14M12 5l7 7-7 7",
      "caret-right": "M9 18l6-6-6-6",
      search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
      user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z",
      menu: "M3 12h18M3 6h18M3 18h18",
    };
    return icons[name] || icons["chevron-right"];
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.style.setProperty("--icon-size", this.size);
    this.style.setProperty("--icon-color", this.color);
  }

  render() {
    return html`
      <svg viewBox="0 0 24 24">
        <path d="${this.getIconPath(this.name)}"></path>
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "jk-icon": JkIcon;
  }
}

if (!customElements.get("jk-icon")) {
  customElements.define("jk-icon", JkIcon);
}
