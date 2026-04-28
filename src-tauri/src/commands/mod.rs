use serde::Serialize;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct HealthcheckResponse {
    pub status: &'static str,
    pub app: &'static str,
    pub local_first: bool,
}

#[tauri::command]
pub fn healthcheck() -> HealthcheckResponse {
    HealthcheckResponse {
        status: "ok",
        app: "ToknIsland",
        local_first: true,
    }
}
