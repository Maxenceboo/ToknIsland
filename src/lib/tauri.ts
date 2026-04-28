import { invoke } from "@tauri-apps/api/core";

export type HealthcheckResponse = {
  status: string;
  app: string;
  localFirst: boolean;
  runtime: "tauri" | "browser-preview";
};

export function healthcheck() {
  if (!isTauriRuntime()) {
    return Promise.resolve({
      status: "preview",
      app: "ToknIsland",
      localFirst: true,
      runtime: "browser-preview" as const,
    });
  }

  return invoke<HealthcheckResponse>("healthcheck");
}

export function isTauriRuntime() {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}
