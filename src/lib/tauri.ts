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

export type TerminalStartRequest = {
  projectPath: string;
  agentId: string;
  threadId: string;
};

export type TerminalWriteRequest = {
  sessionId: string;
  data: string;
};

export type TerminalStopRequest = {
  sessionId: string;
};

export type TerminalSessionResponse = {
  sessionId: string;
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

export function terminalStart(request: TerminalStartRequest) {
  if (!isTauriRuntime()) {
    return Promise.resolve({
      sessionId: request.threadId,
      runtime: "browser-preview" as const,
    });
  }

  return invoke<TerminalSessionResponse>("terminal_start", { request });
}

export function terminalWrite(request: TerminalWriteRequest) {
  if (!isTauriRuntime()) {
    return Promise.resolve();
  }

  return invoke<void>("terminal_write", { request });
}

export function terminalStop(request: TerminalStopRequest) {
  if (!isTauriRuntime()) {
    return Promise.resolve();
  }

  return invoke<void>("terminal_stop", { request });
}

export function isTauriRuntime() {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}
