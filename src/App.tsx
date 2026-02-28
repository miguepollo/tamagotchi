import { useState } from "react";
import { Pet } from "./components/Pet";
import { Stats } from "./components/Stats";
import { Actions } from "./components/Actions";
import { usePet } from "./hooks/usePet";

function App() {
  const { pet, loading, error, createPet, feed, sleep, play, heal, resetPet } = usePet();
  const [showNameInput, setShowNameInput] = useState(false);
  const [name, setName] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">No se pudo cargar la mascota</div>
      </div>
    );
  }

  const handleCreatePet = () => {
    if (name.trim()) {
      createPet(name.trim());
      setShowNameInput(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 p-4">
      <div className="max-w-sm mx-auto space-y-4">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {pet.name}
          </h1>
          <p className="text-sm text-gray-500">
            {pet.state === "Dead" ? "💀 RIP" : `Estado: ${pet.state}`}
          </p>
          {pet.state !== "Dead" && (
            <button
              onClick={() => setShowNameInput(!showNameInput)}
              className="text-xs text-purple-600 hover:underline mt-1"
            >
              Cambiar nombre
            </button>
          )}
        </div>

        {/* Name Input */}
        {showNameInput && (
          <div className="bg-white rounded-lg p-3 shadow-md flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nuevo nombre..."
              className="flex-1 px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
              maxLength={20}
            />
            <button
              onClick={handleCreatePet}
              className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              OK
            </button>
          </div>
        )}

        {/* Pet Display */}
        <Pet state={pet.state} />

        {/* Stats */}
        <Stats stats={pet.stats} />

        {/* Actions */}
        <div className="bg-white rounded-lg p-4 shadow-md">
          <Actions
            onFeed={feed}
            onSleep={sleep}
            onPlay={play}
            onHeal={heal}
            onReset={resetPet}
            state={pet.state}
            health={pet.stats.health}
            energy={pet.stats.energy}
          />
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400">
          Tamagotchi v0.1.0
        </div>
      </div>
    </div>
  );
}

export default App;
