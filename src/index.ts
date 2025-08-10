// Public entry
import "./jk-header";
import "./jk-search";
import "./jk-nav";
import "./jk-header-v2";

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
