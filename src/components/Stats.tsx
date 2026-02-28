import type { Stats } from "../types/pet";

interface StatBarProps {
  label: string;
  value: number;
  color: string;
  icon: string;
}

function StatBar({ label, value, color, icon }: StatBarProps) {
  return (
    <div className="mb-2">
      <div className="flex justify-between text-sm mb-1">
        <span className="flex items-center gap-1">
          <span>{icon}</span>
          <span className="font-medium text-gray-700">{label}</span>
        </span>
        <span className="font-bold text-gray-800">{Math.round(value)}%</span>
      </div>
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full transition-all duration-300 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

interface StatsProps {
  stats: Stats;
}

export function Stats({ stats }: StatsProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <StatBar
        label="Hambre"
        value={stats.hunger}
        color="bg-gradient-to-r from-orange-400 to-orange-500"
        icon="🍖"
      />
      <StatBar
        label="Energía"
        value={stats.energy}
        color="bg-gradient-to-r from-yellow-400 to-yellow-500"
        icon="⚡"
      />
      <StatBar
        label="Felicidad"
        value={stats.happiness}
        color="bg-gradient-to-r from-pink-400 to-pink-500"
        icon="😊"
      />
      <StatBar
        label="Salud"
        value={stats.health}
        color="bg-gradient-to-r from-green-400 to-green-500"
        icon="❤️"
      />
    </div>
  );
}
