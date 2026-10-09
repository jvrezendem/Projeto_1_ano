import { useEffect, useRef, useState } from "react";
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right";
import Camera from "lucide-react/dist/esm/icons/camera";
import Check from "lucide-react/dist/esm/icons/check";
import Heart from "lucide-react/dist/esm/icons/heart";
import ImageUp from "lucide-react/dist/esm/icons/image-up";
import Plus from "lucide-react/dist/esm/icons/plus";
import Save from "lucide-react/dist/esm/icons/save";
import Trash2 from "lucide-react/dist/esm/icons/trash-2";
import UserRound from "lucide-react/dist/esm/icons/user-round";
import * as api from "../api";
import { validarArquivoFoto } from "../photoForm";
import { textoUnicode } from "../text";
import Button from "./Button";
import { Skeleton } from "@/components/ui/skeleton";

function iniciais(nome) {
  return nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join("");
}

export default function ProfilePage({ perfil, onGallery, onProfileUpdated }) {
  const [avatarComFalha, setAvatarComFalha] = useState("");
  const [enviandoAvatar, setEnviandoAvatar] = useState(false);
  const [erroAvatar, setErroAvatar] = useState("");
  const [parceiro, setParceiro] = useState(null);
  const [gostosEditados, setGostosEditados] = useState([]);
  const [estadoGostos, setEstadoGostos] = useState("carregando");
  const [mensagemGostos, setMensagemGostos] = useState("");
  const seletorAvatar = useRef(null);

  const temAvatar = Boolean(perfil.avatarUrl) && perfil.avatarUrl !== avatarComFalha;
  const nome = textoUnicode(perfil.nome);
  const descricao = textoUnicode(perfil.descricao);
  const gostos = (perfil.gostos || perfil.caracteristicas || []).map(textoUnicode);

  useEffect(() => {
    let ativo = true;
    api.obterParceiro()
      .then((dados) => {
        if (!ativo) return;
        setParceiro(dados);
        setGostosEditados((dados.gostos || []).map(textoUnicode));
        setEstadoGostos("pronto");
      })
      .catch((erro) => {
        if (!ativo) return;
        setMensagemGostos(erro.message);
        setEstadoGostos("erro");
      });
    return () => { ativo = false; };
  }, []);

  const selecionarAvatar = async (event) => {
    const arquivo = event.target.files?.[0];
    event.target.value = "";
    const erro = validarArquivoFoto(arquivo);
    if (erro) {
      setErroAvatar(erro);
      return;
    }
    setErroAvatar("");
    setEnviandoAvatar(true);
    try {
      const perfilAtualizado = await api.atualizarAvatar(arquivo);
      onProfileUpdated(perfilAtualizado);
    } catch (falha) {
      setErroAvatar(falha.message);
    } finally {
      setEnviandoAvatar(false);
    }
  };

  const alterarGosto = (indice, valor) => {
    setGostosEditados((atuais) => atuais.map((item, posicao) => posicao === indice ? valor : item));
    setMensagemGostos("");
  };

  const adicionarGosto = () => {
    if (gostosEditados.length < 8) setGostosEditados((atuais) => [...atuais, ""]);
  };

  const removerGosto = (indice) => {
    setGostosEditados((atuais) => atuais.filter((_, posicao) => posicao !== indice));
    setMensagemGostos("");
  };

  const salvarGostos = async (event) => {
    event.preventDefault();
    const valores = gostosEditados.map((item) => item.trim()).filter(Boolean);
    setEstadoGostos("salvando");
    setMensagemGostos("");
    try {
      const atualizado = await api.atualizarGostosDoParceiro(valores);
      setParceiro(atualizado);
      setGostosEditados(atualizado.gostos || []);
      setMensagemGostos("Salvo. Essa mensagem já aparece no perfil de quem você ama.");
      setEstadoGostos("salvo");
    } catch (erro) {
      setMensagemGostos(erro.message);
      setEstadoGostos("erro");
    }
  };

  return (
    <section className="profile-page section-wrap" aria-labelledby="profile-title" lang="pt-BR">
      <span className="eyebrow">QUEM GUARDA ESSAS HISTÓRIAS</span>
      <div className="profile-grid">
        <div className="portrait" data-reveal="left">
          <span className="portrait-border" aria-hidden="true" />
          {temAvatar ? (
            <img src={api.urlDaApi(perfil.avatarUrl)} alt={`Foto de perfil de ${nome}`} onError={() => setAvatarComFalha(perfil.avatarUrl)} />
          ) : iniciais(nome) ? (
            <span className="portrait-letter" aria-label={`Avatar de ${nome}`}>{iniciais(nome).slice(0, 1).toLowerCase()}<em>.</em></span>
          ) : (
            <UserRound className="portrait-user" size={84} aria-label="Avatar padrão" />
          )}
          <input
            ref={seletorAvatar}
            className="visually-hidden"
            type="file"
            accept="image/jpeg,image/png,.jpg,.jpeg,.png"
            onChange={selecionarAvatar}
            tabIndex="-1"
          />
          <button
            type="button"
            className="portrait-upload-trigger"
            onClick={() => seletorAvatar.current?.click()}
            disabled={enviandoAvatar}
            aria-label={temAvatar ? "Trocar minha foto de perfil" : "Enviar minha foto de perfil"}
          >
            {enviandoAvatar ? <span className="spinner" aria-hidden="true" /> : <ImageUp size={18} />}
            <span>{enviandoAvatar ? "Enviando…" : temAvatar ? "Trocar minha foto" : "Enviar minha foto"}</span>
          </button>
          <div className="portrait-caption"><Camera size={18} /><span>Sua foto, escolhida por você</span></div>
          <Heart className="portrait-heart" size={58} fill="currentColor" aria-hidden="true" />
        </div>

        <div className="profile-copy" data-reveal="right">
          <h1 id="profile-title">Oi, eu sou<br /><em>{nome}.</em></h1>
          <p className="profile-lead">{descricao || "Feita de caminhos, encontros e histórias para contar."}</p>
          {erroAvatar ? <p className="profile-feedback profile-feedback--error" role="alert">{erroAvatar}</p> : null}

          <section className="profile-likes" aria-labelledby="profile-likes-title">
            <p className="small-note">ESCRITO POR QUEM ESTÁ DO OUTRO LADO</p>
            <h2 id="profile-likes-title">O que eu mais gosto em você</h2>
            {gostos.length ? (
              <div className="traits" aria-label="O que a outra pessoa mais gosta em você">
                {gostos.map((gosto, indice) => <span key={`${gosto}-${indice}`}><Heart size={15} />{gosto}</span>)}
              </div>
            ) : <p className="profile-empty">A outra pessoa ainda não escreveu seus detalhes favoritos.</p>}
          </section>

          <h2>Um pouco sobre mim</h2>
          <p>{descricao || "Nenhuma descrição informada."}</p>
          <Button type="button" onClick={onGallery}>Ver minhas memórias <ArrowRight size={17} /></Button>
        </div>
      </div>

      <section className="likes-editor" data-reveal="up" aria-labelledby="likes-editor-title">
        <div className="likes-editor-intro">
          <span className="eyebrow">UM RECADO SEU</span>
          <h2 id="likes-editor-title">O que eu mais gosto em <em>{textoUnicode(parceiro?.nome) || "você"}</em></h2>
          <p>Este espaço pertence ao outro perfil, mas só você pode escrever nele. Escolha até oito detalhes que fazem essa pessoa ser única.</p>
        </div>

        {estadoGostos === "carregando" ? (
          <div className="likes-editor-loading" aria-label="Carregando perfil da outra pessoa">
            <Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-3/4" />
          </div>
        ) : estadoGostos === "erro" && !parceiro ? (
          <p className="profile-feedback profile-feedback--error" role="alert">{mensagemGostos}</p>
        ) : (
          <form className="likes-form" onSubmit={salvarGostos}>
            <div className="likes-fields">
              {gostosEditados.map((gosto, indice) => (
                <div className="like-field" key={indice}>
                  <Heart size={17} aria-hidden="true" />
                  <label className="visually-hidden" htmlFor={`gosto-${indice}`}>Detalhe {indice + 1} sobre {parceiro?.nome}</label>
                  <input
                    id={`gosto-${indice}`}
                    value={gosto}
                    maxLength="80"
                    placeholder={indice === 0 ? "O jeito de transformar qualquer dia…" : "Mais um detalhe especial…"}
                    onChange={(event) => alterarGosto(indice, event.target.value)}
                  />
                  <button type="button" className="icon-action" onClick={() => removerGosto(indice)} aria-label={`Remover detalhe ${indice + 1}`}>
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>
            <div className="likes-actions">
              <button type="button" className="add-like" onClick={adicionarGosto} disabled={gostosEditados.length >= 8}>
                <Plus size={17} /> Adicionar detalhe <span>{gostosEditados.length}/8</span>
              </button>
              <Button type="submit" loading={estadoGostos === "salvando"}><Save size={17} /> Salvar para {textoUnicode(parceiro?.nome)}</Button>
            </div>
            {mensagemGostos ? (
              <p className={`profile-feedback ${estadoGostos === "salvo" ? "profile-feedback--success" : "profile-feedback--error"}`} role="status">
                {estadoGostos === "salvo" ? <Check size={16} /> : null}{mensagemGostos}
              </p>
            ) : null}
          </form>
        )}
      </section>
    </section>
  );
}
