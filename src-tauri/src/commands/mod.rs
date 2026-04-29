use serde::Serialize;
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
    let path = thread_jsonl_path(Path::new(&project_path), &thread_id).map_err(|error| error.to_string())?;
    let uri = vscode_file_uri(&path);

    Ok(ThreadIdeTarget {
        path: path.to_string_lossy().to_string(),
        uri,
    })
}

#[cfg(test)]
mod tests {
    use super::{healthcheck, thread_ide_target};

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
}
