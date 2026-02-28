mod pet;
mod storage;

use pet::{Pet, PetState};
use std::sync::Mutex;
use tauri::{Manager, State};

struct AppState {
    pet: Mutex<Pet>,
}

#[tauri::command]
fn get_pet(state: State<AppState>) -> Result<Pet, String> {
    let pet = state.pet.lock().map_err(|e| e.to_string())?;
    Ok(pet.clone())
}

#[tauri::command]
fn create_pet(name: String, state: State<AppState>) -> Result<Pet, String> {
    let mut pet = state.pet.lock().map_err(|e| e.to_string())?;
    *pet = Pet::new(name);
    storage::save_pet(&pet).map_err(|e| e.to_string())?;
    Ok(pet.clone())
}

#[tauri::command]
fn feed(state: State<AppState>) -> Result<Pet, String> {
    let mut pet = state.pet.lock().map_err(|e| e.to_string())?;
    pet.feed()?;
    storage::save_pet(&pet).map_err(|e| e.to_string())?;
    Ok(pet.clone())
}

#[tauri::command]
fn sleep(state: State<AppState>) -> Result<Pet, String> {
    let mut pet = state.pet.lock().map_err(|e| e.to_string())?;
    pet.sleep()?;
    storage::save_pet(&pet).map_err(|e| e.to_string())?;
    Ok(pet.clone())
}

#[tauri::command]
fn play(state: State<AppState>) -> Result<Pet, String> {
    let mut pet = state.pet.lock().map_err(|e| e.to_string())?;
    pet.play()?;
    storage::save_pet(&pet).map_err(|e| e.to_string())?;
    Ok(pet.clone())
}

#[tauri::command]
fn heal(state: State<AppState>) -> Result<Pet, String> {
    let mut pet = state.pet.lock().map_err(|e| e.to_string())?;
    pet.heal()?;
    storage::save_pet(&pet).map_err(|e| e.to_string())?;
    Ok(pet.clone())
}

#[tauri::command]
fn tick(state: State<AppState>) -> Result<Pet, String> {
    let mut pet = state.pet.lock().map_err(|e| e.to_string())?;
    pet.tick();
    storage::save_pet(&pet).map_err(|e| e.to_string())?;
    Ok(pet.clone())
}

#[tauri::command]
fn has_save() -> bool {
    storage::has_save()
}

#[tauri::command]
fn reset_pet(state: State<AppState>) -> Result<(), String> {
    let mut pet = state.pet.lock().map_err(|e| e.to_string())?;
    *pet = Pet::new("Tamagotchi".to_string());
    storage::delete_save().map_err(|e| e.to_string())?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let pet = if storage::has_save() {
        storage::load_pet().unwrap_or_else(|_| Pet::new("Tamagotchi".to_string()))
    } else {
        Pet::new("Tamagotchi".to_string())
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(AppState {
            pet: Mutex::new(pet),
        })
        .invoke_handler(tauri::generate_handler![
            get_pet, create_pet, feed, sleep, play, heal, tick, has_save, reset_pet
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
