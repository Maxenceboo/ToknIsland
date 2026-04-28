use std::path::{Path, PathBuf};

pub const TOKNISLAND_DIR: &str = ".toknisland";
pub const THREADS_DIR: &str = "threads";
pub const STATE_FILE: &str = "state.json";

pub fn project_data_dir(project_root: &Path) -> PathBuf {
    project_root.join(TOKNISLAND_DIR)
}

pub fn threads_dir(project_root: &Path) -> PathBuf {
    project_data_dir(project_root).join(THREADS_DIR)
}

pub fn state_file(project_root: &Path) -> PathBuf {
    project_data_dir(project_root).join(STATE_FILE)
}

#[cfg(test)]
mod tests {
    use std::path::Path;

    use super::{project_data_dir, state_file, threads_dir};

    #[test]
    fn builds_toknisland_paths_from_project_root() {
        let root = Path::new("workspace");

        assert_eq!(project_data_dir(root), Path::new("workspace").join(".toknisland"));
        assert_eq!(
            threads_dir(root),
            Path::new("workspace").join(".toknisland").join("threads")
        );
        assert_eq!(
            state_file(root),
            Path::new("workspace").join(".toknisland").join("state.json")
        );
    }
}
