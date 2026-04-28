use serde::Serialize;

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

#[cfg(test)]
mod tests {
    use super::healthcheck;

    #[test]
    fn healthcheck_reports_local_first_app() {
        let response = healthcheck();

        assert_eq!(response.status, "ok");
        assert_eq!(response.app, "ToknIsland");
        assert!(response.local_first);
        assert_eq!(response.runtime, "tauri");
    }
}
