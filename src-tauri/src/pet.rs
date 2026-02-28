use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum PetState {
    Idle,
    Eating,
    Sleeping,
    Playing,
    Dead,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Stats {
    pub hunger: f64,
    pub energy: f64,
    pub happiness: f64,
    pub health: f64,
}

impl Default for Stats {
    fn default() -> Self {
        Self {
            hunger: 100.0,
            energy: 100.0,
            happiness: 100.0,
            health: 100.0,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Pet {
    pub name: String,
    pub stats: Stats,
    pub state: PetState,
    pub created_at: u64,
    pub last_updated: u64,
}

impl Pet {
    pub fn new(name: String) -> Self {
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();
        
        Self {
            name,
            stats: Stats::default(),
            state: PetState::Idle,
            created_at: now,
            last_updated: now,
        }
    }

    pub fn feed(&mut self) -> Result<(), String> {
        if self.state == PetState::Dead {
            return Err("Pet is dead".to_string());
        }
        self.stats.hunger = (self.stats.hunger + 30.0).min(100.0);
        self.stats.energy = (self.stats.energy - 10.0).max(0.0);
        self.state = PetState::Eating;
        self.update_timestamp();
        Ok(())
    }

    pub fn sleep(&mut self) -> Result<(), String> {
        if self.state == PetState::Dead {
            return Err("Pet is dead".to_string());
        }
        self.stats.energy = (self.stats.energy + 50.0).min(100.0);
        self.state = PetState::Sleeping;
        self.update_timestamp();
        Ok(())
    }

    pub fn play(&mut self) -> Result<(), String> {
        if self.state == PetState::Dead {
            return Err("Pet is dead".to_string());
        }
        if self.stats.energy < 15.0 {
            return Err("Not enough energy to play".to_string());
        }
        self.stats.happiness = (self.stats.happiness + 20.0).min(100.0);
        self.stats.energy -= 15.0;
        self.stats.hunger = (self.stats.hunger - 5.0).max(0.0);
        self.state = PetState::Playing;
        self.update_timestamp();
        Ok(())
    }

    pub fn heal(&mut self) -> Result<(), String> {
        if self.state == PetState::Dead {
            return Err("Pet is dead".to_string());
        }
        if self.stats.health >= 50.0 {
            return Err("Health is above 50, no need to heal".to_string());
        }
        self.stats.health = (self.stats.health + 30.0).min(100.0);
        self.update_timestamp();
        Ok(())
    }

    pub fn tick(&mut self) {
        if self.state == PetState::Dead {
            return;
        }

        // Decay stats
        self.stats.hunger = (self.stats.hunger - 1.0).max(0.0);
        self.stats.energy = (self.stats.energy - 0.5).max(0.0);
        self.stats.happiness = (self.stats.happiness - 0.3).max(0.0);

        // Health affected by hunger and lack of sleep
        if self.stats.hunger < 20.0 {
            self.stats.health = (self.stats.health - 1.0).max(0.0);
        }
        if self.stats.energy < 20.0 {
            self.stats.health = (self.stats.health - 0.5).max(0.0);
        }

        // Check death conditions
        if self.stats.hunger <= 0.0 || self.stats.health <= 0.0 {
            self.state = PetState::Dead;
        }

        // Reset state to Idle after a while (simplified)
        if self.state != PetState::Dead && self.state != PetState::Idle {
            self.state = PetState::Idle;
        }

        self.update_timestamp();
    }

    fn update_timestamp(&mut self) {
        self.last_updated = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();
    }
}
