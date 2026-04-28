use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ProjectState {
    pub version: u16,
    pub project_name: String,
    pub project_path: String,
    pub active_thread_id: Option<String>,
    pub agents: Vec<AgentState>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AgentState {
    pub id: String,
    pub name: String,
    pub accent: String,
    pub conversations: Vec<ConversationState>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ConversationState {
    pub id: String,
    pub title: String,
    pub status: SessionStatus,
    pub thread_path: String,
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
    pub fn new(project_name: impl Into<String>, project_path: impl Into<String>) -> Self {
        Self {
            version: 1,
            project_name: project_name.into(),
            project_path: project_path.into(),
            active_thread_id: None,
            agents: Vec::new(),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::{AgentState, ConversationState, ProjectState, SessionStatus};

    #[test]
    fn creates_versioned_project_state() {
        let state = ProjectState::new("ToknIsland", "C:\\workspace");

        assert_eq!(state.version, 1);
        assert_eq!(state.project_name, "ToknIsland");
        assert_eq!(state.project_path, "C:\\workspace");
        assert!(state.active_thread_id.is_none());
        assert!(state.agents.is_empty());
    }

    #[test]
    fn serializes_session_status_as_snake_case() {
        let conversation = ConversationState {
            id: "thread-1".to_string(),
            title: "Scaffold setup".to_string(),
            status: SessionStatus::Running,
            thread_path: ".toknisland/threads/thread-1.jsonl".to_string(),
        };

        let json = serde_json::to_string(&conversation).expect("conversation should serialize");

        assert!(json.contains("\"status\":\"running\""));
    }

    #[test]
    fn supports_multiple_agents_with_multiple_conversations() {
        let mut state = ProjectState::new("ToknIsland", "C:\\workspace");
        state.agents.push(AgentState {
            id: "codex".to_string(),
            name: "Codex".to_string(),
            accent: "teal".to_string(),
            conversations: vec![
                ConversationState {
                    id: "codex-setup".to_string(),
                    title: "Scaffold setup".to_string(),
                    status: SessionStatus::Completed,
                    thread_path: ".toknisland/threads/codex-setup.jsonl".to_string(),
                },
                ConversationState {
                    id: "codex-runner".to_string(),
                    title: "Runner core".to_string(),
                    status: SessionStatus::Idle,
                    thread_path: ".toknisland/threads/codex-runner.jsonl".to_string(),
                },
            ],
        });

        assert_eq!(state.agents.len(), 1);
        assert_eq!(state.agents[0].conversations.len(), 2);
    }
}
