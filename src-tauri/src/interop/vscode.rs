use std::path::{Path, PathBuf};

use crate::core::{errors::ToknIslandError, paths::threads_dir};

pub fn thread_jsonl_path(project_root: &Path, thread_id: &str) -> Result<PathBuf, ToknIslandError> {
    if !is_safe_thread_id(thread_id) {
        return Err(ToknIslandError::InvalidThreadId);
    }

    Ok(threads_dir(project_root).join(format!("{thread_id}.jsonl")))
}

pub fn vscode_file_uri(path: &Path) -> String {
    let normalized = path.to_string_lossy().replace('\\', "/");

    format!("vscode://file/{normalized}")
}

fn is_safe_thread_id(thread_id: &str) -> bool {
    !thread_id.is_empty()
        && thread_id
            .chars()
            .all(|character| character.is_ascii_alphanumeric() || character == '-' || character == '_')
}

#[cfg(test)]
mod tests {
    use std::path::Path;

    use super::{thread_jsonl_path, vscode_file_uri};

    #[test]
    fn builds_thread_jsonl_path() {
        let path = thread_jsonl_path(Path::new("C:\\Users\\maxen\\Documents\\ToknIsland"), "codex-tests")
            .expect("valid thread id");

        assert_eq!(
            path,
            Path::new("C:\\Users\\maxen\\Documents\\ToknIsland")
                .join(".toknisland")
                .join("threads")
                .join("codex-tests.jsonl")
        );
    }

    #[test]
    fn rejects_path_traversal_thread_ids() {
        assert!(thread_jsonl_path(Path::new("workspace"), "../secret").is_err());
        assert!(thread_jsonl_path(Path::new("workspace"), "").is_err());
    }

    #[test]
    fn builds_vscode_file_uri() {
        let uri = vscode_file_uri(
            &Path::new("C:\\Users\\maxen\\Documents\\ToknIsland")
                .join(".toknisland")
                .join("threads")
                .join("codex-tests.jsonl"),
        );

        assert_eq!(
            uri,
            "vscode://file/C:/Users/maxen/Documents/ToknIsland/.toknisland/threads/codex-tests.jsonl"
        );
    }
}
