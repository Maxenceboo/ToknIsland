mod commands;
mod core;
mod persistence;
mod runner;

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![commands::healthcheck])
        .run(tauri::generate_context!())
        .expect("failed to run ToknIsland");
}
