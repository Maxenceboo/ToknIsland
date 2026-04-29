import { invoke } from "@tauri-apps/api/core";

export type HealthcheckResponse = {
  status: string;
  app: string;
  localFirst: boolean;
  runtime: "tauri" | "browser-preview";
};

export type ThreadIdeTarget = {
  path: string;
  uri: string;
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

export function threadIdeTarget(projectPath: string, threadId: string) {
  if (!isTauriRuntime()) {
    const path = `${projectPath}\\.toknisland\\threads\\${threadId}.jsonl`;

    return Promise.resolve({
      path,
      uri: `vscode://file/${path.replaceAll("\\", "/")}`,
    });
  }

  return invoke<ThreadIdeTarget>("thread_ide_target", { projectPath, threadId });
}

export function isTauriRuntime() {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}
