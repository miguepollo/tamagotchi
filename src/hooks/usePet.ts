import { useState, useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import type { Pet } from "../types/pet";

export function usePet() {
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPet = useCallback(async () => {
    try {
      const result = await invoke<Pet>("get_pet");
      setPet(result);
      setError(null);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const createPet = useCallback(async (name: string) => {
    try {
      setLoading(true);
      const result = await invoke<Pet>("create_pet", { name });
      setPet(result);
      setError(null);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const feed = useCallback(async () => {
    try {
      const result = await invoke<Pet>("feed");
      setPet(result);
      setError(null);
    } catch (e) {
      setError(String(e));
    }
  }, []);

  const sleep = useCallback(async () => {
    try {
      const result = await invoke<Pet>("sleep");
      setPet(result);
      setError(null);
    } catch (e) {
      setError(String(e));
    }
  }, []);

  const play = useCallback(async () => {
    try {
      const result = await invoke<Pet>("play");
      setPet(result);
      setError(null);
    } catch (e) {
      setError(String(e));
    }
  }, []);

  const heal = useCallback(async () => {
    try {
      const result = await invoke<Pet>("heal");
      setPet(result);
      setError(null);
    } catch (e) {
      setError(String(e));
    }
  }, []);

  const tick = useCallback(async () => {
    try {
      const result = await invoke<Pet>("tick");
      setPet(result);
    } catch {
      // Silent fail for tick
    }
  }, []);

  const resetPet = useCallback(async () => {
    try {
      await invoke("reset_pet");
      await fetchPet();
    } catch (e) {
      setError(String(e));
    }
  }, [fetchPet]);

  useEffect(() => {
    fetchPet();
  }, [fetchPet]);

  useEffect(() => {
    if (!pet || pet.state === "Dead") return;
    
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [pet, tick]);

  return {
    pet,
    loading,
    error,
    createPet,
    feed,
    sleep,
    play,
    heal,
    resetPet,
  };
}
