import type { ConversationSummary, ImportedProject } from "./cockpitState";

export type ThreadAction = "resume" | "open-ide" | "raw-jsonl";

export function threadJsonlRelativePath(conversation: ConversationSummary) {
  return `.toknisland/threads/${conversation.id}.jsonl`;
}

export function threadJsonlAbsolutePath(project: ImportedProject, conversation: ConversationSummary) {
  return `${project.path}\\${threadJsonlRelativePath(conversation).replaceAll("/", "\\")}`;
}

export function vscodeThreadUri(project: ImportedProject, conversation: ConversationSummary) {
  const normalizedPath = threadJsonlAbsolutePath(project, conversation).replaceAll("\\", "/");

  return `vscode://file/${normalizedPath}`;
}

export function threadActionFeedback(
  action: ThreadAction,
  project: ImportedProject,
  conversation: ConversationSummary,
) {
  const relativePath = threadJsonlRelativePath(conversation);

  if (action === "resume") {
    return `Would resume ${conversation.title}.jsonl from ${relativePath}`;
  }

  if (action === "open-ide") {
    return `Would open ${relativePath} in VS Code`;
  }

  return `Would inspect raw JSONL at ${relativePath}`;
}
