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
  selectConversation,
} from "./cockpitState";
import { loadCockpitState, saveCockpitState } from "./cockpitPersistence";
import { healthcheck, type HealthcheckResponse } from "../lib/tauri";

export function App() {
  const [health, setHealth] = useState<HealthcheckResponse | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [cockpitState, setCockpitState] = useState(() => detectPreviewExternalSessions(loadCockpitState()));

  const metrics = cockpitMetrics(cockpitState);
  const currentAgent = activeAgent(cockpitState);
  const currentConversation = activeConversation(cockpitState);

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
                        <FolderOpen size={15} />
                        <span>
                          <strong>{agent.name}</strong>
                          <small>{agent.conversations.length} thread files</small>
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
            <button className="icon-button run" type="button" title="Start agent">
              <Play size={18} />
            </button>
            <button className="icon-button stop" type="button" title="Stop agent">
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
              <span>Runner output</span>
            </div>
            <span className="status-pill">standby</span>
          </div>
          <pre>
{`$ ToknIsland runner
${cockpitState.project ? `Project loaded: ${cockpitState.project.name}` : "Waiting for a project and agent command."}
${currentConversation ? `Active conversation: ${currentConversation.title}` : "No active conversation."}
Backend: ${health ? `${health.status} (${health.app}, ${health.runtime})` : healthError ? `offline: ${healthError}` : "checking..."}`}
          </pre>
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
              <code>.toknisland/threads/{currentConversation.id}.jsonl</code>
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
          <div className="heatmap">
            {Array.from({ length: 35 }).map((_, index) => (
              <span key={index} className={index % 7 === 0 ? "hot" : index % 5 === 0 ? "warm" : ""} />
            ))}
          </div>
          <div className="detail-row">
            <BarChart3 size={17} />
            <span>Token parser</span>
            <strong>planned</strong>
          </div>
        </section>
      </aside>
    </main>
  );
}
