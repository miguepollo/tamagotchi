use std::fs;
use std::io;
use std::path::PathBuf;

use crate::pet::Pet;

fn get_save_path() -> PathBuf {
    let home = dirs::home_dir().unwrap_or_else(|| PathBuf::from("."));
    home.join(".tamagotchi").join("save.json")
}

pub fn save_pet(pet: &Pet) -> io::Result<()> {
    let path = get_save_path();
    
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)?;
    }
    
    let json = serde_json::to_string_pretty(pet)?;
    fs::write(&path, json)?;
    Ok(())
}

pub fn load_pet() -> io::Result<Pet> {
    let path = get_save_path();
    let json = fs::read_to_string(&path)?;
    let pet: Pet = serde_json::from_str(&json)?;
    Ok(pet)
}

pub fn has_save() -> bool {
    get_save_path().exists()
}

pub fn delete_save() -> io::Result<()> {
    let path = get_save_path();
    if path.exists() {
        fs::remove_file(&path)?;
    }
    Ok(())
}
