export type Environment = "dev" | "staging" | "prod";
export type ThemeMode = "light" | "dark" | "auto";

export interface HeaderEndpoints {
  me?: string; // e.g., "/api/header/me"
  menus?: string; // e.g., "/api/header/menus"
  notifications?: string;
}
