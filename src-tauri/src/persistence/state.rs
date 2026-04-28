use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ProjectState {
    pub version: u16,
    pub project_path: String,
    pub active_thread_id: Option<String>,
    pub sessions: Vec<SessionState>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct SessionState {
    pub id: String,
    pub agent: String,
    pub status: SessionStatus,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum SessionStatus {
    Idle,
    Running,
    Stopped,
    Failed,
    Completed,
}

impl ProjectState {
    pub fn new(project_path: impl Into<String>) -> Self {
        Self {
            version: 1,
            project_path: project_path.into(),
            active_thread_id: None,
            sessions: Vec::new(),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::{ProjectState, SessionState, SessionStatus};

    #[test]
    fn creates_versioned_project_state() {
        let state = ProjectState::new("C:\\workspace");

        assert_eq!(state.version, 1);
        assert_eq!(state.project_path, "C:\\workspace");
        assert!(state.active_thread_id.is_none());
        assert!(state.sessions.is_empty());
    }

    #[test]
    fn serializes_session_status_as_snake_case() {
        let session = SessionState {
            id: "thread-1".to_string(),
            agent: "Codex".to_string(),
            status: SessionStatus::Running,
        };

        let json = serde_json::to_string(&session).expect("session should serialize");

        assert!(json.contains("\"status\":\"running\""));
    }
}
