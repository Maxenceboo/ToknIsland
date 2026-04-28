import {
  Activity,
  BarChart3,
  CircleStop,
  FolderOpen,
  Gauge,
  Play,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  activeConversation,
  agentWorkspaces,
  cockpitMetrics,
  initialCockpitState,
  openPreviewProject,
  projectLabel,
} from "./cockpitState";
import { healthcheck, type HealthcheckResponse } from "../lib/tauri";

export function App() {
  const [health, setHealth] = useState<HealthcheckResponse | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [cockpitState, setCockpitState] = useState(initialCockpitState);

  const agents = agentWorkspaces(cockpitState);
  const metrics = cockpitMetrics(cockpitState);
  const currentConversation = activeConversation(cockpitState);

  useEffect(() => {
    healthcheck()
      .then(setHealth)
      .catch((error: unknown) => {
        setHealthError(error instanceof Error ? error.message : String(error));
      });
  }, []);

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
          Open project
        </button>

        <section className="stack">
          <div className="section-title">Agents & conversations</div>
          {agents.length === 0 ? (
            <div className="empty-list">Import a project to list agents.</div>
          ) : (
            agents.map((agent) => (
              <div className="agent-group" key={agent.id}>
                <div className="agent-heading">
                  <span className={`agent-dot ${agent.accent}`} />
                  <strong>{agent.name}</strong>
                  <small>{agent.conversations.length}</small>
                </div>
                {agent.conversations.map((conversation) => (
                  <button className="session-row conversation-row" key={conversation.id} type="button">
                    <span>
                      <strong>{conversation.title}</strong>
                      <small>
                        {conversation.status} · {conversation.tokens}
                      </small>
                    </span>
                  </button>
                ))}
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
