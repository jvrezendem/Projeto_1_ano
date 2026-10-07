import Moon from "lucide-react/dist/esm/icons/moon";
import Pause from "lucide-react/dist/esm/icons/pause";
import Play from "lucide-react/dist/esm/icons/play";
import Sun from "lucide-react/dist/esm/icons/sun";

export function ThemeControl({ tema, onToggle, compact = false }) {
  const escuro = tema === "escuro";
  const Icon = escuro ? Sun : Moon;
  const label = escuro ? "Usar tema claro" : "Usar tema escuro";
  return (
    <button
      className={compact ? "icon-button visual-control--compact" : "visual-control"}
      type="button"
      aria-label={label}
      title={label}
      onClick={onToggle}
    >
      <Icon size={20} />
      {compact ? null : <span>{escuro ? "Tema claro" : "Tema escuro"}</span>}
    </button>
  );
}

export function MotionControl({ paused, systemPaused, onToggle }) {
  const Icon = paused ? Play : Pause;
  const label = systemPaused
    ? "Movimento reduzido pelo sistema"
    : paused ? "Retomar animações" : "Pausar animações";
  return (
    <button
      className="visual-control"
      type="button"
      aria-pressed={paused}
      disabled={systemPaused}
      title={label}
      onClick={onToggle}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );
}
