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
