import Moon from "lucide-react/dist/esm/icons/moon";
import Pause from "lucide-react/dist/esm/icons/pause";
import Play from "lucide-react/dist/esm/icons/play";
import Sun from "lucide-react/dist/esm/icons/sun";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

function ControlTooltip({ label, children }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={8}>{label}</TooltipContent>
    </Tooltip>
  );
}

export function ThemeControl({ tema, onToggle, compact = false }) {
  const escuro = tema === "escuro";
  const Icon = escuro ? Sun : Moon;
  const label = escuro ? "Usar tema claro" : "Usar tema escuro";
  const control = (
    <button
      className={compact ? "icon-button visual-control--compact" : "visual-control"}
      type="button"
      aria-label={label}
      onClick={onToggle}
    >
      <Icon size={20} />
      {compact ? null : <span>{escuro ? "Tema claro" : "Tema escuro"}</span>}
    </button>
  );
  return compact ? <ControlTooltip label={label}>{control}</ControlTooltip> : control;
}

export function MotionControl({ paused, systemPaused, onToggle, compact = false }) {
  const Icon = paused ? Play : Pause;
  const label = systemPaused
    ? "Movimento reduzido pelo sistema"
    : paused ? "Retomar animações" : "Pausar animações";
  const control = (
    <button
      className={compact ? "icon-button visual-control--compact" : "visual-control"}
      type="button"
      aria-label={label}
      aria-pressed={paused}
      disabled={systemPaused}
      onClick={onToggle}
    >
      <Icon size={20} />
      {compact ? null : <span>{label}</span>}
    </button>
  );
  return compact ? <ControlTooltip label={label}>{control}</ControlTooltip> : control;
}
