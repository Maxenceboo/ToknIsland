use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ProjectState {
    pub version: u16,
    pub imported_projects: Vec<ImportedProjectState>,
    pub external_sessions: Vec<ExternalSessionState>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ImportedProjectState {
    pub id: String,
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
#[serde(rename_all = "camelCase")]
pub struct ExternalSessionState {
    pub id: String,
    pub project_path: String,
    pub agent_name: String,
    pub terminal: String,
    pub pid: u32,
    pub status: ExternalSessionStatus,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum ExternalSessionStatus {
    Detected,
    Attached,
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
    pub fn new() -> Self {
        Self {
            version: 1,
            imported_projects: Vec::new(),
            external_sessions: Vec::new(),
        }
    }

    pub fn import_project(&mut self, project: ImportedProjectState) {
        if self
            .imported_projects
            .iter()
            .any(|imported_project| imported_project.project_path == project.project_path)
        {
            return;
        }

        self.imported_projects.push(project);
    }
}

impl ImportedProjectState {
    pub fn new(
        id: impl Into<String>,
        project_name: impl Into<String>,
        project_path: impl Into<String>,
    ) -> Self {
        Self {
            id: id.into(),
            project_name: project_name.into(),
            project_path: project_path.into(),
            active_thread_id: None,
            agents: Vec::new(),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::{
        AgentState, ConversationState, ExternalSessionState, ExternalSessionStatus, ImportedProjectState,
        ProjectState, SessionStatus,
    };

    #[test]
    fn creates_versioned_project_state() {
        let state = ProjectState::new();

        assert_eq!(state.version, 1);
        assert!(state.imported_projects.is_empty());
        assert!(state.external_sessions.is_empty());
    }

    #[test]
    fn imports_project_only_once_by_path() {
        let mut state = ProjectState::new();
        let project = ImportedProjectState::new("toknisland", "ToknIsland", "C:\\workspace");

        state.import_project(project.clone());
        state.import_project(project);

        assert_eq!(state.imported_projects.len(), 1);
        assert_eq!(state.imported_projects[0].project_name, "ToknIsland");
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
        let mut project = ImportedProjectState::new("toknisland", "ToknIsland", "C:\\workspace");
        project.agents.push(AgentState {
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

        assert_eq!(project.agents.len(), 1);
        assert_eq!(project.agents[0].conversations.len(), 2);
    }

    #[test]
    fn tracks_external_terminal_sessions() {
        let mut state = ProjectState::new();
        state.external_sessions.push(ExternalSessionState {
            id: "external-codex-terminal".to_string(),
            project_path: "C:\\workspace".to_string(),
            agent_name: "Codex".to_string(),
            terminal: "PowerShell".to_string(),
            pid: 4242,
            status: ExternalSessionStatus::Detected,
        });

        assert_eq!(state.external_sessions.len(), 1);
        assert_eq!(state.external_sessions[0].status, ExternalSessionStatus::Detected);
    }
}
