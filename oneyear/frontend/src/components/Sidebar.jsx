import GalleryVerticalEnd from "lucide-react/dist/esm/icons/gallery-vertical-end";
import House from "lucide-react/dist/esm/icons/house";
import LogOut from "lucide-react/dist/esm/icons/log-out";
import UserRound from "lucide-react/dist/esm/icons/user-round";
import BrandLogo from "./BrandLogo";
import { MotionControl, ThemeControl } from "./VisualControls";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const itens = [
  { id: "inicial", label: "Inicial", Icon: House },
  { id: "galeria", label: "Galeria", Icon: GalleryVerticalEnd },
  { id: "perfil", label: "Perfil", Icon: UserRound },
];

export default function Sidebar({ page, tema, movimentoPausado, movimentoSistema, onNavigate, onLogout, onToggleTheme, onToggleMotion }) {
  return (
    <header className="topbar">
      <button className="brand-button" type="button" aria-label="Abrir página inicial" onClick={() => onNavigate("inicial")}>
        <BrandLogo alt="" />
      </button>

      <nav className="floating-nav" aria-label="Navegação principal">
        {itens.map(({ id, label, Icon }) => (
          <Tooltip key={id}>
            <TooltipTrigger asChild>
              <button
                className="nav-item"
                type="button"
                aria-current={page === id ? "page" : undefined}
                aria-label={label}
                onClick={() => onNavigate(id)}
              >
                <Icon size={16} aria-hidden="true" />
                <span>{label}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent className="mobile-nav-tooltip" side="bottom" sideOffset={8}>{label}</TooltipContent>
          </Tooltip>
        ))}
      </nav>

      <div className="topbar-actions" aria-label="Preferências e sessão">
        <ThemeControl tema={tema} onToggle={onToggleTheme} compact />
        <MotionControl paused={movimentoPausado} systemPaused={movimentoSistema} onToggle={onToggleMotion} compact />
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="icon-button logout-button" type="button" aria-label="Sair" onClick={onLogout}>
              <LogOut size={18} aria-hidden="true" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={8}>Sair</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
