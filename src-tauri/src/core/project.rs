use std::path::{Path, PathBuf};

use super::errors::ToknIslandError;

#[derive(Debug, Clone)]
pub struct ProjectRoot {
    path: PathBuf,
}

impl ProjectRoot {
    pub fn new(path: impl AsRef<Path>) -> Result<Self, ToknIslandError> {
        let path = path.as_ref();

        if !path.exists() || !path.is_dir() {
            return Err(ToknIslandError::InvalidProjectPath);
        }

        Ok(Self {
            path: path.to_path_buf(),
        })
    }

    pub fn path(&self) -> &Path {
        &self.path
    }
}
