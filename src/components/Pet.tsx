import { useEffect, useRef, useState } from "react";
import type { PetState } from "../types/pet";

const SPRITE_SIZE = 32;
const SCALE = 4;

// Simple pixel art colors for each state
const SPRITES: Record<PetState, number[][][]> = {
  Idle: [
    // Frame 1 - neutral
    [
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [1, 2, 2, 3, 3, 2, 2, 1],
      [1, 2, 3, 3, 3, 3, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 0, 1, 2, 2, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
    ],
    // Frame 2 - slight bounce
    [
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 2, 2, 1, 0, 0],
      [0, 1, 2, 3, 3, 2, 1, 0],
      [1, 2, 3, 3, 3, 3, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 0, 1, 2, 2, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
    ],
  ],
  Eating: [
    // Frame 1 - mouth open
    [
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [1, 2, 2, 3, 3, 2, 2, 1],
      [1, 2, 3, 3, 3, 3, 2, 1],
      [1, 2, 4, 4, 2, 2, 2, 1],
      [0, 1, 4, 4, 2, 2, 1, 0],
      [0, 0, 1, 2, 2, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
    ],
    // Frame 2 - mouth closed
    [
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [1, 2, 2, 3, 3, 2, 2, 1],
      [1, 2, 3, 3, 3, 3, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 0, 1, 2, 2, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
    ],
  ],
  Sleeping: [
    // Frame 1 - eyes closed, Z floating
    [
      [0, 5, 0, 0, 0, 0, 0, 0],
      [0, 0, 5, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 0],
      [0, 0, 1, 2, 2, 2, 2, 1],
      [0, 1, 2, 6, 6, 2, 2, 1],
      [0, 1, 2, 6, 6, 2, 2, 1],
      [0, 0, 1, 2, 2, 2, 1, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
    ],
    // Frame 2 - Z moved
    [
      [0, 0, 5, 0, 0, 0, 0, 0],
      [0, 0, 0, 5, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 0],
      [0, 0, 1, 2, 2, 2, 2, 1],
      [0, 1, 2, 6, 6, 2, 2, 1],
      [0, 1, 2, 6, 6, 2, 2, 1],
      [0, 0, 1, 2, 2, 2, 1, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
    ],
  ],
  Playing: [
    // Frame 1 - jump up
    [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 1, 2, 7, 7, 2, 1, 0],
      [1, 2, 7, 7, 7, 7, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 0, 1, 2, 2, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
    ],
    // Frame 2 - jump down
    [
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 1, 2, 7, 7, 2, 1, 0],
      [1, 2, 7, 7, 7, 7, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 0, 1, 2, 2, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ],
  ],
  Dead: [
    // Single frame - X eyes
    [
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [1, 2, 8, 2, 2, 8, 2, 1],
      [1, 2, 2, 8, 8, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 0, 1, 2, 2, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
    ],
    [
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [1, 2, 8, 2, 2, 8, 2, 1],
      [1, 2, 2, 8, 8, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 0, 1, 2, 2, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
    ],
  ],
};

const COLORS: Record<number, string> = {
  0: "transparent",
  1: "#2d1b00",
  2: "#ffb347",
  3: "#000000",
  4: "#ff0000",
  5: "#87ceeb",
  6: "#1a1a1a",
  7: "#ffd700",
  8: "#ff3333",
};

interface PetProps {
  state: PetState;
}

export function Pet({ state }: PetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sprites = SPRITES[state];
    const currentFrame = sprites[frame % sprites.length];

    ctx.clearRect(0, 0, SPRITE_SIZE * SCALE, SPRITE_SIZE * SCALE);
    ctx.imageSmoothingEnabled = false;

    for (let y = 0; y < currentFrame.length; y++) {
      for (let x = 0; x < currentFrame[y].length; x++) {
        const colorIndex = currentFrame[y][x];
        const color = COLORS[colorIndex];
        if (color !== "transparent") {
          ctx.fillStyle = color;
          ctx.fillRect(
            x * SCALE * 4,
            y * SCALE,
            SCALE * 4,
            SCALE
          );
        }
      }
    }
  }, [state, frame]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => f + 1);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center bg-gradient-to-b from-sky-200 to-sky-100 rounded-lg p-4">
      <canvas
        ref={canvasRef}
        width={SPRITE_SIZE * SCALE}
        height={SPRITE_SIZE * SCALE}
        className="pixelated"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}
