import { useCallback, useEffect, useRef, useState } from "react";
import CalendarDays from "lucide-react/dist/esm/icons/calendar-days";
import GalleryVerticalEnd from "lucide-react/dist/esm/icons/gallery-vertical-end";
import ImageOff from "lucide-react/dist/esm/icons/image-off";
import MapPin from "lucide-react/dist/esm/icons/map-pin";
import Plus from "lucide-react/dist/esm/icons/plus";
import RotateCcw from "lucide-react/dist/esm/icons/rotate-ccw";
import * as api from "../api";
import Button from "./Button";
import PhotoUploadDialog from "./PhotoUploadDialog";

function dataDaFoto(foto) {
  if (!foto.dataCaptura) return "Data não informada";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${foto.dataCaptura}T00:00:00Z`));
}

export default function GalleryPage({ onUnauthorized }) {
  const [consulta, setConsulta] = useState({ estado: "carregando", fotos: [] });
  const [cadastroAberto, setCadastroAberto] = useState(false);
  const [aviso, setAviso] = useState("");
  const [imagensFalhas, setImagensFalhas] = useState([]);
  const botaoAdicionarRef = useRef(null);

  const carregar = useCallback(async () => {
    try {
      const pagina = await api.listarFotos();
      setConsulta({ estado: "pronto", fotos: pagina.items || [] });
    } catch (erro) {
      if (erro instanceof api.ApiError && erro.status === 401) onUnauthorized();
      else setConsulta((atual) => ({ ...atual, estado: "erro" }));
    }
  }, [onUnauthorized]);

  useEffect(() => {
    let ativo = true;
    api.listarFotos().then((pagina) => {
      if (ativo) setConsulta({ estado: "pronto", fotos: pagina.items || [] });
    }).catch((erro) => {
      if (!ativo) return;
      if (erro instanceof api.ApiError && erro.status === 401) onUnauthorized();
      else setConsulta({ estado: "erro", fotos: [] });
    });
    return () => { ativo = false; };
  }, [onUnauthorized]);

  const fecharCadastro = () => {
    setCadastroAberto(false);
    requestAnimationFrame(() => botaoAdicionarRef.current?.focus());
  };

  const registrarFoto = (foto, mensagem) => {
    setConsulta((atual) => ({
      estado: "pronto",
      fotos: [foto, ...atual.fotos.filter((item) => item.id !== foto.id)],
    }));
    setAviso(mensagem);
  };

  return (
    <section className="gallery-page" aria-labelledby="gallery-title">
      <header className="gallery-header">
        <div>
          <h1 id="gallery-title">Galeria</h1>
          <p>Guarde uma nova memória ou reveja as que já fazem parte da história.</p>
        </div>
        <Button ref={botaoAdicionarRef} type="button" onClick={() => setCadastroAberto(true)}>
          <Plus size={20} /> Adicionar foto
        </Button>
      </header>

      {aviso ? <div className="gallery-notice" role="status">{aviso}</div> : null}

      {consulta.estado === "carregando" ? (
        <div className="gallery-loading" aria-label="Carregando galeria" aria-busy="true">
          {Array.from({ length: 6 }, (_, indice) => <span key={indice} />)}
        </div>
      ) : null}

      {consulta.estado === "erro" ? (
        <div className="gallery-empty" role="alert">
          <ImageOff size={48} aria-hidden="true" />
          <h2>Não foi possível carregar a galeria.</h2>
          <Button type="button" variant="outline" onClick={carregar}><RotateCcw size={18} /> Tentar novamente</Button>
        </div>
      ) : null}

      {consulta.estado === "pronto" && consulta.fotos.length === 0 ? (
        <div className="gallery-empty" role="status">
          <GalleryVerticalEnd size={48} aria-hidden="true" />
          <h2>Suas memórias vão aparecer aqui.</h2>
          <p>Adicione a primeira foto da coleção compartilhada.</p>
        </div>
      ) : null}

      {consulta.estado === "pronto" && consulta.fotos.length > 0 ? (
        <div className="photo-grid" aria-label="Fotos da coleção">
          {consulta.fotos.map((foto) => {
            const falhou = imagensFalhas.includes(foto.id);
            return (
              <article className="photo-card" key={foto.id}>
                <div className="photo-frame">
                  {falhou ? <div className="photo-fallback"><ImageOff /><span>Imagem indisponível</span></div> : (
                    <img
                      src={api.urlDaApi(foto.arquivoUrl)}
                      alt={foto.legenda || "Foto da coleção"}
                      onError={() => setImagensFalhas((atuais) => [...atuais, foto.id])}
                    />
                  )}
                </div>
                <div className="photo-card-copy">
                  <h2>{foto.legenda || "Memória sem legenda"}</h2>
                  <p><CalendarDays size={15} /> {dataDaFoto(foto)}</p>
                  <p><MapPin size={15} /> {foto.lugar || "Local não informado"}</p>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

      {cadastroAberto ? (
        <PhotoUploadDialog
          onClose={fecharCadastro}
          onSaved={registrarFoto}
          onUnauthorized={onUnauthorized}
          onRefresh={carregar}
        />
      ) : null}
    </section>
  );
}
