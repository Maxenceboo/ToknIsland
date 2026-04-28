use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum ThreadEvent {
    SessionStarted {
        timestamp: String,
        session_id: String,
        agent: String,
    },
    OutputChunk {
        timestamp: String,
        session_id: String,
        data: String,
    },
    SessionStopped {
        timestamp: String,
        session_id: String,
        code: Option<i32>,
    },
}

impl ThreadEvent {
    pub fn session_id(&self) -> &str {
        match self {
            Self::SessionStarted { session_id, .. }
            | Self::OutputChunk { session_id, .. }
            | Self::SessionStopped { session_id, .. } => session_id,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::ThreadEvent;

    #[test]
    fn exposes_session_id_for_all_events() {
        let event = ThreadEvent::OutputChunk {
            timestamp: "2026-04-28T00:00:00Z".to_string(),
            session_id: "thread-1".to_string(),
            data: "hello".to_string(),
        };

        assert_eq!(event.session_id(), "thread-1");
    }

    #[test]
    fn serializes_event_type_for_jsonl() {
        let event = ThreadEvent::SessionStarted {
            timestamp: "2026-04-28T00:00:00Z".to_string(),
            session_id: "thread-1".to_string(),
            agent: "Codex".to_string(),
        };

        let json = serde_json::to_string(&event).expect("event should serialize");

        assert!(json.contains("\"type\":\"session_started\""));
        assert!(json.contains("\"session_id\":\"thread-1\""));
    }
}
