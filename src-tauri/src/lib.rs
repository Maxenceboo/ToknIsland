mod commands;
mod core;
mod interop;
mod persistence;
mod runner;

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::healthcheck,
            commands::thread_ide_target
        ])
        .run(tauri::generate_context!())
        .expect("failed to run ToknIsland");
}
