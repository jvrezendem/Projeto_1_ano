import { useCallback, useEffect, useRef, useState } from "react";
import GalleryVerticalEnd from "lucide-react/dist/esm/icons/gallery-vertical-end";
import House from "lucide-react/dist/esm/icons/house";
import LogOut from "lucide-react/dist/esm/icons/log-out";
import Menu from "lucide-react/dist/esm/icons/menu";
import UserRound from "lucide-react/dist/esm/icons/user-round";
import X from "lucide-react/dist/esm/icons/x";
import { MotionControl, ThemeControl } from "./VisualControls";

const itens = [
  { id: "inicial", label: "Inicial", Icon: House },
  { id: "galeria", label: "Galeria", Icon: GalleryVerticalEnd },
  { id: "perfil", label: "Perfil", Icon: UserRound },
];

export default function Sidebar({ page, tema, movimentoPausado, movimentoSistema, onNavigate, onLogout, onToggleTheme, onToggleMotion }) {
  const [aberta, setAberta] = useState(false);
  const menuRef = useRef(null);
  const primeiroItemRef = useRef(null);

  const fecharMenu = useCallback(() => {
    setAberta(false);
    requestAnimationFrame(() => menuRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!aberta) return undefined;
    primeiroItemRef.current?.focus();
    const fecharComEscape = (event) => {
      if (event.key === "Escape") fecharMenu();
    };
    document.addEventListener("keydown", fecharComEscape);
    return () => document.removeEventListener("keydown", fecharComEscape);
  }, [aberta, fecharMenu]);

  const navegar = (id) => {
    fecharMenu();
    onNavigate(id);
  };

  return (
    <>
      <header className="mobile-header">
        <span className="wordmark" translate="no">ana<span>.</span></span>
        <button
          ref={menuRef}
          className="icon-button"
          type="button"
          aria-label={aberta ? "Fechar menu" : "Abrir menu"}
          aria-expanded={aberta}
          aria-controls="menu-principal"
          onClick={() => setAberta((valor) => !valor)}
        >
          {aberta ? <X /> : <Menu />}
        </button>
      </header>
      {aberta ? <button className="drawer-backdrop" type="button" aria-label="Fechar menu" onClick={fecharMenu} /> : null}
      <aside className={`sidebar ${aberta ? "sidebar--open" : ""}`} aria-label="Navegação principal">
        <span className="wordmark sidebar-wordmark" translate="no">ana<span>.</span></span>
        <nav id="menu-principal">
          {itens.map(({ id, label, Icon }, index) => (
            <button
              key={id}
              ref={index === 0 ? primeiroItemRef : undefined}
              className="nav-item"
              type="button"
              aria-current={page === id ? "page" : undefined}
              onClick={() => navegar(id)}
            >
              <Icon size={21} /><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-preferences" aria-label="Preferências visuais">
          <ThemeControl tema={tema} onToggle={onToggleTheme} />
          <MotionControl paused={movimentoPausado} systemPaused={movimentoSistema} onToggle={onToggleMotion} />
        </div>
        <button className="logout-button" type="button" onClick={onLogout}>
          <LogOut size={20} /><span>Sair</span>
        </button>
      </aside>
    </>
  );
}
