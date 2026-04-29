mod commands;
mod core;
mod interop;
mod persistence;
mod runner;

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::healthcheck,
            commands::thread_ide_target,
            commands::terminal_start,
            commands::terminal_write,
            commands::terminal_stop
        ])
        .run(tauri::generate_context!())
        .expect("failed to run ToknIsland");
}
