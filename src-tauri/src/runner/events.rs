use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum RunnerEvent {
    SessionStarted { session_id: String },
    OutputChunk { session_id: String, data: String },
    StderrChunk { session_id: String, data: String },
    ProcessExited { session_id: String, code: Option<i32> },
    SessionInterrupted { session_id: String },
    SessionFailed { session_id: String, message: String },
}
