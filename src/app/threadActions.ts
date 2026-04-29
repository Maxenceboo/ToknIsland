import type { AgentWorkspace, ConversationSummary, ImportedProject } from "./cockpitState";

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

export function previewThreadJsonl(
  project: ImportedProject,
  agent: AgentWorkspace,
  conversation: ConversationSummary,
) {
  return [
    {
      type: "session_resumed",
      project_path: project.path,
      agent_id: agent.id,
      thread_id: conversation.id,
      title: conversation.title,
    },
    {
      type: "thread_summary",
      status: conversation.status,
      tokens: conversation.tokens,
      storage: threadJsonlRelativePath(conversation),
    },
    {
      type: "output_chunk",
      stream: "stdout",
      data: `Preview loaded for ${conversation.title}.jsonl`,
    },
  ]
    .map((event) => JSON.stringify(event))
    .join("\n");
}
