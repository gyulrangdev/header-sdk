// SVG 아이콘 템플릿들
export const iconTemplates = {
  "chevron-right": `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="9,18 15,12 9,6"></polyline>
    </svg>
  `,
  "arrow-right": `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 12h14"></path>
      <path d="M12 5l7 7-7 7"></path>
    </svg>
  `,
  search: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <path d="M21 21l-4.35-4.35"></path>
    </svg>
  `,
};

// HTML Template를 사용하는 방식
export function createIconFromTemplate(name: string): HTMLElement {
  const template = document.createElement("template");
  template.innerHTML = `
    <span class="jk-icon" style="display: inline-block; width: 16px; height: 16px;">
      ${
        iconTemplates[name as keyof typeof iconTemplates] ||
        iconTemplates["chevron-right"]
      }
    </span>
  `;
  return template.content.firstElementChild as HTMLElement;
}
