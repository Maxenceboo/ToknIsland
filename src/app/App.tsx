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
import { healthcheck, type HealthcheckResponse } from "../lib/tauri";

const sessions = [
  { id: "local-draft", agent: "Codex", status: "Idle", tokens: "0" },
  { id: "runner-plan", agent: "Claude", status: "Planned", tokens: "0" },
  { id: "analytics", agent: "Custom", status: "Backlog", tokens: "0" },
];

const metrics = [
  { label: "Active agents", value: "0" },
  { label: "Saved threads", value: "0" },
  { label: "Token cost", value: "$0.00" },
];

export function App() {
  const [health, setHealth] = useState<HealthcheckResponse | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);

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

        <button className="primary-action" type="button">
          <FolderOpen size={17} />
          Open project
        </button>

        <section className="stack">
          <div className="section-title">Sessions</div>
          {sessions.map((session) => (
            <button className="session-row" key={session.id} type="button">
              <span className="agent-dot" />
              <span>
                <strong>{session.agent}</strong>
                <small>{session.status}</small>
              </span>
            </button>
          ))}
        </section>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <span className="eyebrow">No project selected</span>
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
Waiting for a project and agent command.
Backend: ${health ? `${health.status} (${health.app})` : healthError ? `offline: ${healthError}` : "checking..."}`}
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
            <strong>idle</strong>
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
