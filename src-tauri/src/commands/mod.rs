use serde::{Deserialize, Serialize};
use std::path::Path;

use crate::interop::vscode::{thread_jsonl_path, vscode_file_uri};

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct HealthcheckResponse {
    pub status: &'static str,
    pub app: &'static str,
    pub local_first: bool,
    pub runtime: &'static str,
}

#[tauri::command]
pub fn healthcheck() -> HealthcheckResponse {
    HealthcheckResponse {
        status: "ok",
        app: "ToknIsland",
        local_first: true,
        runtime: "tauri",
    }
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ThreadIdeTarget {
    pub path: String,
    pub uri: String,
}

#[tauri::command]
pub fn thread_ide_target(project_path: String, thread_id: String) -> Result<ThreadIdeTarget, String> {
    let path = thread_jsonl_path(Path::new(&project_path), &thread_id)
        .map_err(|error| error.to_string())?;
    let uri = vscode_file_uri(&path);

    Ok(ThreadIdeTarget {
        path: path.to_string_lossy().to_string(),
        uri,
    })
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TerminalStartRequest {
    pub project_path: String,
    pub agent_id: String,
    pub thread_id: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TerminalWriteRequest {
    pub session_id: String,
    pub data: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TerminalStopRequest {
    pub session_id: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TerminalSessionResponse {
    pub session_id: String,
    pub runtime: &'static str,
}

#[tauri::command]
pub fn terminal_start(request: TerminalStartRequest) -> Result<TerminalSessionResponse, String> {
    if request.project_path.trim().is_empty()
        || request.agent_id.trim().is_empty()
        || request.thread_id.trim().is_empty()
    {
        return Err("terminal start request is incomplete".to_string());
    }

    Ok(TerminalSessionResponse {
        session_id: request.thread_id,
        runtime: "tauri",
    })
}

#[tauri::command]
pub fn terminal_write(request: TerminalWriteRequest) -> Result<(), String> {
    if request.session_id.trim().is_empty() {
        return Err("terminal session id is required".to_string());
    }

    let _ = request.data;
    Ok(())
}

#[tauri::command]
pub fn terminal_stop(request: TerminalStopRequest) -> Result<(), String> {
    if request.session_id.trim().is_empty() {
        return Err("terminal session id is required".to_string());
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::{
        healthcheck, terminal_start, terminal_stop, terminal_write, thread_ide_target,
        TerminalStartRequest, TerminalStopRequest, TerminalWriteRequest,
    };

    #[test]
    fn healthcheck_reports_local_first_app() {
        let response = healthcheck();

        assert_eq!(response.status, "ok");
        assert_eq!(response.app, "ToknIsland");
        assert!(response.local_first);
        assert_eq!(response.runtime, "tauri");
    }

    #[test]
    fn thread_ide_target_returns_path_and_uri() {
        let response = thread_ide_target(
            "C:\\Users\\maxen\\Documents\\ToknIsland".to_string(),
            "codex-tests".to_string(),
        )
        .expect("valid target");

        assert!(response.path.ends_with(".toknisland\\threads\\codex-tests.jsonl"));
        assert_eq!(
            response.uri,
            "vscode://file/C:/Users/maxen/Documents/ToknIsland/.toknisland/threads/codex-tests.jsonl"
        );
    }

    #[test]
    fn terminal_commands_validate_session_requests() {
        let session = terminal_start(TerminalStartRequest {
            project_path: "C:\\Users\\maxen\\Documents\\ToknIsland".to_string(),
            agent_id: "codex".to_string(),
            thread_id: "codex-tests".to_string(),
        })
        .expect("valid terminal start request");

        assert_eq!(session.session_id, "codex-tests");
        assert_eq!(session.runtime, "tauri");
        assert!(terminal_write(TerminalWriteRequest {
            session_id: "codex-tests".to_string(),
            data: "hello".to_string(),
        })
        .is_ok());
        assert!(terminal_stop(TerminalStopRequest {
            session_id: "codex-tests".to_string(),
        })
        .is_ok());
    }
}
