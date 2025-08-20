// Public entry

import "./jk-search";
import "./jk-nav";
import "./jk-header-v2";
import "./jk-icon";
import "./jk-total-menu";

export type { HeaderEndpoints } from "./types";

export function ready(): Promise<void> {
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    document.addEventListener("DOMContentLoaded", () => resolve(), {
      once: true,
    });
  });
}
