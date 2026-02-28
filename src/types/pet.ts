export type PetState = "Idle" | "Eating" | "Sleeping" | "Playing" | "Dead";

export interface Stats {
  hunger: number;
  energy: number;
  happiness: number;
  health: number;
}

export interface Pet {
  name: string;
  stats: Stats;
  state: PetState;
  created_at: number;
  last_updated: number;
}
