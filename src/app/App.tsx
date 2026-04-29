import {
  Activity,
  BarChart3,
  CircleStop,
  FileText,
  FolderOpen,
  Gauge,
  Play,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  activeConversation,
  activeAgent,
  attachExternalSession,
  cockpitMetrics,
  detectPreviewExternalSessions,
  importedProjectCount,
  initialCockpitState,
  openPreviewProject,
  projectLabel,
  resumeConversation,
  selectConversation,
  startRunner,
  stopRunner,
} from "./cockpitState";
import { loadCockpitState, loadCockpitUiState, saveCockpitState, saveCockpitUiState } from "./cockpitPersistence";
import { previewThreadJsonl, threadActionFeedback, threadJsonlRelativePath } from "./threadActions";
import { runnerPreviewEvent, runnerPreviewOutput } from "./runnerPreview";
import { heatmapCells, projectTokenTotal } from "./cockpitAnalytics";
import { summarizeAgent } from "./agentSummary";
import { healthcheck, threadIdeTarget, type HealthcheckResponse } from "../lib/tauri";

type TerminalMode = "runner" | "raw-jsonl";

export function App() {
  const [cockpitUiState, setCockpitUiState] = useState(loadCockpitUiState);
  const [health, setHealth] = useState<HealthcheckResponse | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [cockpitState, setCockpitState] = useState(() => detectPreviewExternalSessions(loadCockpitState()));
  const [actionFeedback, setActionFeedback] = useState("Ready for local actions.");
  const terminalMode = cockpitUiState.terminalMode;
  const runnerEvents = cockpitUiState.runnerEvents;

  const metrics = cockpitMetrics(cockpitState);
  const tokenTotal = projectTokenTotal(cockpitState.project);
  const heatmap = heatmapCells(cockpitState, runnerEvents);
  const currentAgent = activeAgent(cockpitState);
  const currentConversation = activeConversation(cockpitState);
  const currentThreadPath = currentConversation ? threadJsonlRelativePath(currentConversation) : null;
  const backendStatus = health
    ? `${health.status} (${health.app}, ${health.runtime})`
    : healthError
      ? `offline: ${healthError}`
      : "checking...";
  const terminalOutput =
    terminalMode === "raw-jsonl" && cockpitState.project && currentAgent && currentConversation
      ? previewThreadJsonl(cockpitState.project, currentAgent, currentConversation)
      : runnerPreviewOutput({
          project: cockpitState.project,
          agent: currentAgent,
          conversation: currentConversation,
          backend: backendStatus,
          status: cockpitState.runnerStatus,
          events: runnerEvents,
        });

  function startPreviewRunner() {
    const nextState = startRunner(cockpitState);
    const nextConversation = activeConversation(nextState);

    setCockpitState(nextState);
    setCockpitUiState((state) => ({
      terminalMode: "runner",
      runnerEvents: [...state.runnerEvents, runnerPreviewEvent("start", nextConversation)].slice(-25),
    }));
    setActionFeedback("Started preview runner for the active thread.");
  }

  function stopPreviewRunner() {
    setCockpitState(stopRunner);
    if (cockpitState.runnerStatus === "running") {
      setCockpitUiState((state) => ({
        terminalMode: "runner",
        runnerEvents: [...state.runnerEvents, runnerPreviewEvent("stop", currentConversation)].slice(-25),
      }));
    } else {
      setCockpitUiState((state) => ({ ...state, terminalMode: "runner" }));
    }
    setActionFeedback(
      cockpitState.runnerStatus === "running" ? "Stopped preview runner." : "Runner is already idle.",
    );
  }

  async function previewThreadAction(action: "resume" | "open-ide" | "raw-jsonl") {
    if (!cockpitState.project || !currentConversation) {
      return;
    }

    if (action === "resume") {
      setCockpitState(resumeConversation);
      setCockpitUiState((state) => ({
        terminalMode: "runner",
        runnerEvents: [...state.runnerEvents, runnerPreviewEvent("resume", currentConversation)].slice(-25),
      }));
      setActionFeedback(threadActionFeedback(action, cockpitState.project, currentConversation));
      return;
    }

    if (action === "open-ide") {
      const target = await threadIdeTarget(cockpitState.project.path, currentConversation.id);
      setActionFeedback(`Would open ${target.path} in VS Code`);
      return;
    }

    if (action === "raw-jsonl") {
      setCockpitUiState((state) => ({ ...state, terminalMode: "raw-jsonl" }));
    }

    setActionFeedback(threadActionFeedback(action, cockpitState.project, currentConversation));
  }

  useEffect(() => {
    healthcheck()
      .then(setHealth)
      .catch((error: unknown) => {
        setHealthError(error instanceof Error ? error.message : String(error));
      });
  }, []);

  useEffect(() => {
    saveCockpitState(cockpitState);
  }, [cockpitState]);

  useEffect(() => {
    saveCockpitUiState(cockpitUiState);
  }, [cockpitUiState]);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">TI</div>
          <div>
            <h1>ToknIsland</h1>
            <p>Local agent cockpit</p>
          </div>
        </div>

        <button className="primary-action" type="button" onClick={() => setCockpitState(openPreviewProject)}>
          <FolderOpen size={17} />
          Import project
        </button>

        <section className="tree-panel">
          <div className="section-title">Project tree</div>
          {cockpitState.importedProjects.length === 0 ? (
            <div className="empty-list">No imported project yet.</div>
          ) : (
            cockpitState.importedProjects.map((project) => (
              <div className="tree-project" key={project.path}>
                <button className="tree-node project-node" type="button">
                  <FolderOpen size={16} />
                  <span>
                    <strong>{project.name}</strong>
                    <small>{project.agents.length} agent folders</small>
                  </span>
                </button>

                <div className="tree-children">
                  {project.agents.map((agent) => (
                    <div className="tree-agent" key={agent.id}>
                      <div className="tree-node agent-node">
                        <span className={`agent-dot ${agent.accent}`} aria-hidden="true" />
                        <span>
                          <strong>{agent.name}</strong>
                          <small>
                            {summarizeAgent(agent).threadCount} threads | {summarizeAgent(agent).tokenLabel} tokens
                          </small>
                        </span>
                      </div>

                      <div className="tree-children thread-children">
                        {agent.conversations.map((conversation) => (
                          <button
                            className={`tree-node thread-node ${
                              cockpitState.activeConversationId === conversation.id ? "active" : ""
                            }`}
                            key={conversation.id}
                            type="button"
                            aria-label={`Select thread ${conversation.title}.jsonl`}
                            onClick={() => setCockpitState((state) => selectConversation(state, agent.id, conversation.id))}
                          >
                            <FileText size={14} />
                            <span>
                              <strong>{conversation.title}.jsonl</strong>
                              <small>
                                {conversation.status} | {conversation.tokens}
                              </small>
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </section>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <span className="eyebrow">{projectLabel(cockpitState.project)}</span>
            <h2>Cockpit</h2>
          </div>
          <div className="toolbar">
            <button
              className="icon-button run"
              type="button"
              title="Start agent"
              aria-label="Start agent"
              onClick={startPreviewRunner}
            >
              <Play size={18} />
            </button>
            <button
              className="icon-button stop"
              type="button"
              title="Stop agent"
              aria-label="Stop agent"
              onClick={stopPreviewRunner}
            >
              <CircleStop size={18} />
            </button>
          </div>
        </header>

        <section className="context-strip" aria-label="Active context">
          <div className="context-main">
            <span className="context-node">
              <FolderOpen size={16} />
              {cockpitState.project?.name ?? "No project"}
            </span>
            <span className="context-separator">/</span>
            <span className="context-node">{currentAgent?.name ?? "No IA"}</span>
            <span className="context-separator">/</span>
            <span className="context-node">
              <FileText size={15} />
              {currentConversation ? `${currentConversation.title}.jsonl` : "No thread"}
            </span>
          </div>
          <div className="context-badges">
            <span className="mini-badge">{cockpitState.runnerStatus}</span>
            <span className="mini-badge">{health?.runtime ?? "checking"}</span>
          </div>
        </section>

        <div className="metrics">
          {metrics.map((metric) => (
            <div className="metric" key={metric.label}>
              <small>{metric.label}</small>
              <strong>{metric.value}</strong>
            </div>
          ))}
        </div>

        <section className="terminal-panel">
          <div className="panel-header">
            <div>
              <Terminal size={18} />
              <span>{terminalMode === "raw-jsonl" ? "Raw JSONL" : "Runner output"}</span>
            </div>
            <span className="status-pill">{cockpitState.runnerStatus}</span>
          </div>
          <pre>{terminalOutput}</pre>
        </section>
      </section>

      <aside className="details">
        <section>
          <div className="section-title">System</div>
          <div className="detail-row">
            <ShieldCheck size={17} />
            <span>Local-first</span>
            <strong>{health?.localFirst ? "on" : "pending"}</strong>
          </div>
          <div className="detail-row">
            <Gauge size={17} />
            <span>Memory target</span>
            <strong>&lt; 80 MB</strong>
          </div>
          <div className="detail-row">
            <Activity size={17} />
            <span>Runner</span>
            <strong>{cockpitState.runnerStatus}</strong>
          </div>
          <div className="detail-row">
            <FolderOpen size={17} />
            <span>Imported projects</span>
            <strong>{importedProjectCount(cockpitState)}</strong>
          </div>
        </section>

        <section>
          <div className="section-title">Selected thread</div>
          {currentConversation && currentAgent ? (
            <div className="thread-card">
              <div className="thread-card-title">
                <FileText size={18} />
                <strong>{currentConversation.title}.jsonl</strong>
              </div>
              <div className="thread-meta">
                <span>IA folder</span>
                <strong>{currentAgent.name}</strong>
              </div>
              <div className="thread-meta">
                <span>Status</span>
                <strong>{currentConversation.status}</strong>
              </div>
              <div className="thread-meta">
                <span>Tokens</span>
                <strong>{currentConversation.tokens}</strong>
              </div>
              <code>{currentThreadPath}</code>
              <div className="thread-actions" aria-label="Thread actions">
                <button type="button" onClick={() => previewThreadAction("resume")}>
                  <Play size={15} />
                  Resume
                </button>
                <button type="button" onClick={() => previewThreadAction("open-ide")}>
                  <FolderOpen size={15} />
                  Open in IDE
                </button>
                <button type="button" onClick={() => previewThreadAction("raw-jsonl")}>
                  <FileText size={15} />
                  Raw JSONL
                </button>
              </div>
              <div className="action-feedback" role="status">
                {actionFeedback}
              </div>
            </div>
          ) : (
            <div className="empty-list">No thread selected.</div>
          )}
        </section>

        <section>
          <div className="section-title">External terminals</div>
          <div className="subtle-note">Detected automatically on startup.</div>
          {cockpitState.externalSessions.length === 0 ? (
            <div className="empty-list">No external agent detected.</div>
          ) : (
            cockpitState.externalSessions.map((session) => (
              <button
                className="external-row"
                key={session.id}
                type="button"
                aria-label={`Attach ${session.agentName} session from ${session.terminal}`}
                onClick={() => setCockpitState((state) => attachExternalSession(state, session.id))}
              >
                <strong>{session.agentName}</strong>
                <small>
                  {session.terminal} | pid {session.pid} | {session.status}
                </small>
              </button>
            ))
          )}
        </section>

        <section>
          <div className="section-title">Analytics</div>
          <div className="heatmap" aria-label="Token activity heatmap">
            {heatmap.map((cell) => (
              <span key={cell.id} className={`level-${cell.level}`} />
            ))}
          </div>
          <div className="detail-row">
            <BarChart3 size={17} />
            <span>Token parser</span>
            <strong>{tokenTotal}</strong>
          </div>
          <div className="detail-row">
            <Activity size={17} />
            <span>Runner events</span>
            <strong>{runnerEvents.length}</strong>
          </div>
        </section>
      </aside>
    </main>
  );
}
