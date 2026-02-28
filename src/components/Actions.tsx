import type { PetState } from "../types/pet";

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  icon: string;
  label: string;
  color: string;
}

function ActionButton({ onClick, disabled, icon, label, color }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex flex-col items-center justify-center p-3 rounded-lg
        transition-all duration-200 transform
        ${disabled 
          ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
          : `${color} text-white hover:scale-105 active:scale-95 shadow-md hover:shadow-lg`
        }
      `}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-xs font-medium mt-1">{label}</span>
    </button>
  );
}

interface ActionsProps {
  onFeed: () => void;
  onSleep: () => void;
  onPlay: () => void;
  onHeal: () => void;
  onReset: () => void;
  state: PetState;
  health: number;
  energy: number;
}

export function Actions({ 
  onFeed, 
  onSleep, 
  onPlay, 
  onHeal, 
  onReset,
  state, 
  health, 
  energy 
}: ActionsProps) {
  const isDead = state === "Dead";
  const canHeal = health < 50 && !isDead;
  const canPlay = energy >= 15 && !isDead;

  return (
    <div className="grid grid-cols-4 gap-2">
      <ActionButton
        onClick={onFeed}
        disabled={isDead}
        icon="🍖"
        label="Comer"
        color="bg-gradient-to-b from-orange-500 to-orange-600"
      />
      <ActionButton
        onClick={onSleep}
        disabled={isDead}
        icon="💤"
        label="Dormir"
        color="bg-gradient-to-b from-indigo-500 to-indigo-600"
      />
      <ActionButton
        onClick={onPlay}
        disabled={!canPlay}
        icon="🎮"
        label="Jugar"
        color="bg-gradient-to-b from-purple-500 to-purple-600"
      />
      <ActionButton
        onClick={onHeal}
        disabled={!canHeal}
        icon="💊"
        label="Curar"
        color="bg-gradient-to-b from-green-500 to-green-600"
      />
      {isDead && (
        <div className="col-span-4 mt-2">
          <ActionButton
            onClick={onReset}
            icon="🔄"
            label="Reiniciar"
            color="bg-gradient-to-b from-red-500 to-red-600"
          />
        </div>
      )}
    </div>
  );
}
