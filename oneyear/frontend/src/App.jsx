import { useCallback, useEffect, useRef, useState } from "react";
import RotateCcw from "lucide-react/dist/esm/icons/rotate-ccw";
import * as api from "./api";
import Button from "./components/Button";
import GalleryPage from "./components/GalleryPage";
import HistoriaPage from "./components/HistoriaPage";
import LoginPage from "./components/LoginPage";
import ProfilePage from "./components/ProfilePage";
import Sidebar from "./components/Sidebar";
import { aplicarPreferencias, lerPreferencias, salvarPreferencia, TEMA_CLARO, TEMA_ESCURO } from "./preferences";

const preferenciasIniciais = lerPreferencias();
aplicarPreferencias(preferenciasIniciais);

const lerPagina = () => {
  if (location.hash === "#perfil") return "perfil";
  if (location.hash === "#galeria") return "galeria";
  return "inicial";
};

export default function App() {
  const [sessao, setSessao] = useState({ estado: "carregando", perfil: null });
  const [pagina, setPagina] = useState(lerPagina);
  const [aviso, setAviso] = useState("");
  const [tema, setTema] = useState(preferenciasIniciais.tema);
  const [movimentoPausado, setMovimentoPausado] = useState(preferenciasIniciais.movimentoPausado);
  const logoutPendente = useRef(false);

  useEffect(() => {
    aplicarPreferencias({ tema, movimentoPausado });
  }, [tema, movimentoPausado]);

  const carregarPerfil = useCallback(async () => {
    try {
      const perfil = await api.obterPerfil();
      setSessao({ estado: "autenticada", perfil });
    } catch (erro) {
      if (erro instanceof api.ApiError && erro.status === 401) {
        setSessao({ estado: "anonima", perfil: null });
      } else {
        setSessao({ estado: "erro", perfil: null });
      }
    }
  }, []);

  useEffect(() => {
    let ativo = true;
    queueMicrotask(() => {
      if (ativo) carregarPerfil();
    });
    return () => {
      ativo = false;
    };
  }, [carregarPerfil]);

  useEffect(() => {
    const atualizarPagina = () => setPagina(lerPagina());
    window.addEventListener("hashchange", atualizarPagina);
    return () => window.removeEventListener("hashchange", atualizarPagina);
  }, []);

  useEffect(() => {
    if (sessao.estado !== "autenticada") return undefined;
    const revalidar = () => carregarPerfil();
    const aoExibir = (event) => event.persisted && revalidar();
    window.addEventListener("focus", revalidar);
    window.addEventListener("pageshow", aoExibir);
    return () => {
      window.removeEventListener("focus", revalidar);
      window.removeEventListener("pageshow", aoExibir);
    };
  }, [carregarPerfil, sessao.estado]);

  useEffect(() => {
    const repetirLogout = async () => {
      if (!logoutPendente.current) return;
      try {
        await api.sair();
        logoutPendente.current = false;
        setAviso("Saída confirmada pelo servidor.");
      } catch {}
    };
    window.addEventListener("online", repetirLogout);
    return () => window.removeEventListener("online", repetirLogout);
  }, []);

  const entrar = async (login, senha) => {
    const perfil = await api.entrar(login, senha);
    setAviso("");
    setSessao({ estado: "autenticada", perfil });
    history.replaceState(null, "", "#inicial");
    setPagina("inicial");
  };

  const voltarAoLogin = useCallback(() => {
    setSessao({ estado: "anonima", perfil: null });
    history.replaceState(null, "", "#login");
    setPagina("inicial");
  }, []);

  const sair = async () => {
    setSessao({ estado: "anonima", perfil: null });
    history.replaceState(null, "", "#login");
    try {
      await api.sair();
      setAviso("");
    } catch {
      logoutPendente.current = true;
      setAviso("A tela foi limpa, mas não foi possível confirmar a saída. Tentaremos novamente quando a conexão voltar.");
    }
  };

  const navegar = async (destino) => {
    try {
      const perfil = await api.obterPerfil();
      setSessao({ estado: "autenticada", perfil });
      location.hash = destino;
    } catch (erro) {
      if (erro instanceof api.ApiError && erro.status === 401) voltarAoLogin();
      else setAviso("Não foi possível abrir esta área. Tente novamente.");
    }
  };

  const alternarTema = () => {
    setTema((atual) => {
      const proximo = atual === TEMA_ESCURO ? TEMA_CLARO : TEMA_ESCURO;
      salvarPreferencia("tema", proximo);
      return proximo;
    });
  };

  const alternarMovimento = () => {
    if (preferenciasIniciais.movimentoSistema) return;
    setMovimentoPausado((atual) => {
      salvarPreferencia("movimento", !atual);
      return !atual;
    });
  };

  if (sessao.estado === "carregando") {
    return <main className="status-page" aria-busy="true"><span className="spinner" /><p>Verificando sessão…</p></main>;
  }

  if (sessao.estado === "erro") {
    return (
      <main className="status-page">
        <h1>Não foi possível verificar sua sessão.</h1>
        <p>Confira a conexão e tente novamente.</p>
        <Button type="button" variant="outline" onClick={carregarPerfil}>
          <RotateCcw size={18} /> Tentar novamente
        </Button>
      </main>
    );
  }

  if (sessao.estado === "anonima") {
    return <LoginPage tema={tema} onLogin={entrar} onToggleTheme={alternarTema} notice={aviso} />;
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Sidebar
        page={pagina}
        tema={tema}
        movimentoPausado={movimentoPausado}
        movimentoSistema={preferenciasIniciais.movimentoSistema}
        onNavigate={navegar}
        onLogout={sair}
        onToggleTheme={alternarTema}
        onToggleMotion={alternarMovimento}
      />
      <main className="app-content" id="conteudo" tabIndex="-1">
        {pagina === "perfil" ? <ProfilePage key={sessao.perfil.id} perfil={sessao.perfil} /> : null}
        {pagina === "galeria" ? <GalleryPage /> : null}
        {pagina === "inicial" ? (
          <HistoriaPage onGallery={() => navegar("galeria")} onUnauthorized={voltarAoLogin} />
        ) : null}
      </main>
    </div>
  );
}
