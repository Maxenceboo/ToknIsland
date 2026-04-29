use thiserror::Error;

#[derive(Debug, Error)]
pub enum ToknIslandError {
    #[error("project path is invalid")]
    InvalidProjectPath,

    #[error("thread id is invalid")]
    InvalidThreadId,

    #[error("io error: {0}")]
    Io(#[from] std::io::Error),
}
