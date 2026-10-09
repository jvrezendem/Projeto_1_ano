import { useState } from "react";
import Eye from "lucide-react/dist/esm/icons/eye";
import EyeOff from "lucide-react/dist/esm/icons/eye-off";
import Button from "./Button";
import BrandLogo from "./BrandLogo";
import LoginMap from "./LoginMap";
import { ThemeControl } from "./VisualControls";

export default function LoginPage({ tema, onLogin, onToggleTheme, notice }) {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [campos, setCampos] = useState({});
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const enviar = async (event) => {
    event.preventDefault();
    const novosCampos = {
      login: login.trim() ? "" : "Informe o login.",
      senha: senha ? "" : "Informe a senha.",
    };
    setCampos(novosCampos);
    setErro("");
    if (novosCampos.login || novosCampos.senha) return;

    setEnviando(true);
    try {
      await onLogin(login.trim(), senha);
    } catch {
      setErro("Não foi possível entrar. Confira os dados e tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="login-page" id="conteudo">
      <section className="login-content" aria-labelledby="login-title">
        <header className="login-header">
          <a className="brand-link" href="#login" aria-label="Página de login">
            <BrandLogo />
          </a>
          <ThemeControl tema={tema} onToggle={onToggleTheme} compact />
        </header>
        <div className="login-copy">
          <h1 id="login-title">Nossos melhores<br /><em>momentos.</em></h1>
          <p>Um espaço para guardar lembranças.</p>
        </div>

        <form className="login-form" onSubmit={enviar} noValidate>
          <div className="field">
            <label htmlFor="login">Login</label>
            <input
              id="login"
              name="login"
              autoComplete="username"
              value={login}
              aria-invalid={Boolean(campos.login)}
              aria-describedby={campos.login ? "login-error" : undefined}
              onChange={(event) => setLogin(event.target.value)}
              disabled={enviando}
            />
            {campos.login ? <span id="login-error" className="field-error">{campos.login}</span> : null}
          </div>

          <div className="field">
            <label htmlFor="senha">Senha</label>
            <div className="password-field">
              <input
                id="senha"
                name="senha"
                type={mostrarSenha ? "text" : "password"}
                autoComplete="current-password"
                value={senha}
                aria-invalid={Boolean(campos.senha)}
                aria-describedby={campos.senha ? "senha-error" : undefined}
                onChange={(event) => setSenha(event.target.value)}
                disabled={enviando}
              />
              <button
                className="password-toggle"
                type="button"
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                aria-pressed={mostrarSenha}
                onClick={() => setMostrarSenha((valor) => !valor)}
              >
                {mostrarSenha ? <EyeOff size={21} /> : <Eye size={21} />}
              </button>
            </div>
            {campos.senha ? <span id="senha-error" className="field-error">{campos.senha}</span> : null}
          </div>

          <Button className="login-submit" type="submit" loading={enviando}>Entrar</Button>
          {erro ? <p className="inline-alert" role="alert">{erro}</p> : null}
          {notice ? <p className="inline-notice" role="status">{notice}</p> : null}
        </form>
      </section>

      <LoginMap />
    </main>
  );
}
