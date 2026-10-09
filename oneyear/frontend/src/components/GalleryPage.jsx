import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ArrowUpRight from "lucide-react/dist/esm/icons/arrow-up-right";
import GalleryVerticalEnd from "lucide-react/dist/esm/icons/gallery-vertical-end";
import Heart from "lucide-react/dist/esm/icons/heart";
import ImageOff from "lucide-react/dist/esm/icons/image-off";
import MapPin from "lucide-react/dist/esm/icons/map-pin";
import Plus from "lucide-react/dist/esm/icons/plus";
import RotateCcw from "lucide-react/dist/esm/icons/rotate-ccw";
import * as api from "../api";
import { agruparFotosPorAno, formatarData, nomeDoLugar } from "../memory";
import Button from "./Button";
import MemoryDetailDialog from "./MemoryDetailDialog";
import MemoryMap from "./MemoryMap";
import PhotoUploadDialog from "./PhotoUploadDialog";
import { Skeleton } from "@/components/ui/skeleton";

function lerAnoDaUrl() {
  const valor = new URLSearchParams(location.hash.split("?")[1] || "").get("ano");
  return /^\d{4}$/.test(valor || "") ? valor : "";
}

export default function GalleryPage({ onUnauthorized }) {
  const [consulta, setConsulta] = useState({ estado: "carregando", fotos: [], page: 0, hasNext: false, totalElements: 0 });
  const [anos, setAnos] = useState([]);
  const [ano, setAno] = useState(lerAnoDaUrl);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [erroProxima, setErroProxima] = useState("");
  const [cadastroAberto, setCadastroAberto] = useState(false);
  const [selecao, setSelecao] = useState(null);
  const [aviso, setAviso] = useState("");
  const [imagensFalhas, setImagensFalhas] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const botaoAdicionarRef = useRef(null);
  const grupos = useMemo(() => agruparFotosPorAno(consulta.fotos), [consulta.fotos]);

  const recarregar = useCallback(() => {
    setConsulta((atual) => ({ ...atual, estado: "carregando" }));
    setErroProxima("");
    setRefreshKey((valor) => valor + 1);
  }, []);

  useEffect(() => {
    let ativo = true;
    Promise.all([api.listarAnos(), api.listarFotos({ ano: ano || undefined })]).then(([listaAnos, pagina]) => {
      if (!ativo) return;
      setAnos(listaAnos || []);
      setConsulta({
        estado: "pronto",
        fotos: pagina.items || [],
        page: pagina.page,
        hasNext: pagina.hasNext,
        totalElements: pagina.totalElements,
      });
    }).catch((erro) => {
      if (!ativo) return;
      if (erro instanceof api.ApiError && erro.status === 401) onUnauthorized();
      else setConsulta({ estado: "erro", fotos: [], page: 0, hasNext: false, totalElements: 0 });
    });
    return () => { ativo = false; };
  }, [ano, onUnauthorized, refreshKey]);

  const carregarMais = async () => {
    setCarregandoMais(true);
    setErroProxima("");
    try {
      const pagina = await api.listarFotos({ page: consulta.page + 1, ano: ano || undefined });
      setConsulta((atual) => ({
        ...atual,
        fotos: [...atual.fotos, ...(pagina.items || [])],
        page: pagina.page,
        hasNext: pagina.hasNext,
        totalElements: pagina.totalElements,
      }));
    } catch (erro) {
      if (erro instanceof api.ApiError && erro.status === 401) onUnauthorized();
      else setErroProxima("Não foi possível carregar mais fotos. As memórias já exibidas foram preservadas.");
    } finally {
      setCarregandoMais(false);
    }
  };

  const trocarAno = (proximoAno) => {
    setConsulta({ estado: "carregando", fotos: [], page: 0, hasNext: false, totalElements: 0 });
    setErroProxima("");
    setAno(proximoAno);
    history.replaceState(null, "", proximoAno ? `#galeria?ano=${proximoAno}` : "#galeria");
  };

  const abrirDetalhe = useCallback((fotoIds, indice = 0, opener = document.activeElement) => {
    setSelecao({ fotoIds, indice, opener });
  }, []);

  const fecharDetalhe = useCallback(() => setSelecao(null), []);

  const fecharCadastro = () => {
    setCadastroAberto(false);
    requestAnimationFrame(() => botaoAdicionarRef.current?.focus());
  };

  const registrarFoto = (_foto, mensagem) => {
    setAviso(mensagem);
    recarregar();
  };

  return (
    <section className="gallery-page section-wrap" aria-labelledby="gallery-title">
      <header className="gallery-header" data-reveal="hero">
        <div>
          <span className="eyebrow">GALERIA / LINHA DO TEMPO</span>
          <h1 id="gallery-title">O tempo passa.<br />A memória <em>fica.</em></h1>
          <p>Do primeiro registro aos capítulos mais recentes.<br />Uma coleção de dias que merecem ser lembrados.</p>
        </div>
        <Button ref={botaoAdicionarRef} type="button" onClick={() => setCadastroAberto(true)}>
          <Plus size={20} /> Adicionar foto
        </Button>
      </header>

      {aviso ? <div className="gallery-notice" role="status">{aviso}</div> : null}

      <section className="gallery-collection" aria-labelledby="photos-title">
        <div className="gallery-toolbar" data-reveal="up">
          <div><span className="eyebrow">NOSSA COLEÇÃO</span><h2 id="photos-title">Capítulos guardados.</h2></div>
          <span className="small-note">Mais antigas primeiro</span>
        </div>

        <div className="gallery-filters" aria-label="Filtrar por ano">
          <button type="button" className={!ano ? "selected" : ""} aria-pressed={!ano} disabled={carregandoMais} onClick={() => trocarAno("")}>Todas as memórias</button>
          {anos.map((item) => (
            <button key={item} type="button" className={ano === String(item) ? "selected" : ""} aria-pressed={ano === String(item)} disabled={carregandoMais} onClick={() => trocarAno(String(item))}>{item}</button>
          ))}
        </div>

        {consulta.estado === "carregando" ? (
          <div className="gallery-loading" aria-label="Carregando galeria" aria-busy="true">
            {Array.from({ length: 3 }, (_, indice) => <Skeleton key={indice} />)}
          </div>
        ) : null}

        {consulta.estado === "erro" ? (
          <div className="gallery-empty" role="alert">
            <ImageOff size={48} aria-hidden="true" />
            <h2>Não foi possível carregar a galeria.</h2>
            <Button type="button" variant="outline" onClick={recarregar}><RotateCcw size={18} /> Tentar novamente</Button>
          </div>
        ) : null}

        {consulta.estado === "pronto" && consulta.fotos.length === 0 ? (
          <div className="gallery-empty" role="status">
            <GalleryVerticalEnd size={48} aria-hidden="true" />
            <h2>{ano ? `Nenhuma memória encontrada em ${ano}.` : "Suas memórias vão aparecer aqui."}</h2>
            <p>{ano ? "Escolha outro ano ou volte para Todas as memórias." : "Adicione a primeira foto da coleção compartilhada."}</p>
          </div>
        ) : null}

        {consulta.estado === "pronto" && consulta.fotos.length > 0 ? (
          <div className="photo-groups">
            {grupos.map((grupo) => (
              <section key={grupo.ano} className="photo-group" aria-labelledby={`photo-year-${grupo.ano}`}>
                <h3 id={`photo-year-${grupo.ano}`}>{grupo.ano === "sem-data" ? "Sem data" : grupo.ano} <span>{grupo.items.length} {grupo.items.length === 1 ? "memória" : "memórias"}</span></h3>
                <div className="photo-grid" aria-label={grupo.ano === "sem-data" ? "Fotos sem data" : `Fotos de ${grupo.ano}`}>
                  {grupo.items.map((foto, indice) => {
                    const falhou = imagensFalhas.includes(foto.id);
                    return (
                      <article className={`photo-card photo-card--${indice % 3}`} key={foto.id} data-reveal="up" style={{ "--reveal-delay": `${(indice % 3) * 80}ms` }}>
                        <button type="button" className="photo-card-button" onClick={(event) => abrirDetalhe([foto.id], 0, event.currentTarget)}>
                          <div className="photo-frame">
                            {falhou ? <div className="photo-fallback"><ImageOff /><span>Imagem indisponível</span></div> : (
                              <img
                                src={api.urlDaApi(foto.arquivoUrl)}
                                alt={foto.legenda || "Foto da coleção"}
                                loading="lazy"
                                onError={() => setImagensFalhas((atuais) => atuais.includes(foto.id) ? atuais : [...atuais, foto.id])}
                              />
                            )}
                            <span className="photo-overlay"><span>{nomeDoLugar(foto)}</span><ArrowUpRight size={20} /></span>
                            <span className="photo-year">{foto.dataCaptura?.slice(0, 4) || "—"}</span>
                          </div>
                          <div className="photo-card-copy">
                            <span className="card-meta"><span>{formatarData(foto.dataCaptura)}</span><Heart size={15} /></span>
                            <h4>{foto.legenda || "Memória sem legenda"}</h4>
                            <p><MapPin size={15} /> {nomeDoLugar(foto)}</p>
                          </div>
                        </button>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        ) : null}

        {erroProxima ? <div className="load-more-error" role="alert">{erroProxima}</div> : null}
        {consulta.estado === "pronto" && consulta.hasNext ? (
          <Button type="button" variant="outline" className="load-more" disabled={carregandoMais} onClick={carregarMais}>
            {carregandoMais ? <span className="spinner" /> : null}
            {erroProxima ? "Tentar carregar novamente" : `Carregar mais (${consulta.fotos.length} de ${consulta.totalElements})`}
          </Button>
        ) : null}
      </section>

      <section className="gallery-map" aria-labelledby="gallery-map-title">
        <div className="section-heading" data-reveal="up">
          <div><span className="eyebrow">ONDE TUDO ACONTECEU</span><h2 id="gallery-map-title">Mapa das <em>memórias.</em></h2></div>
          <p>Selecione um coração ou use a lista para abrir as memórias localizadas.</p>
        </div>
        <div data-reveal="scale"><MemoryMap onSelect={abrirDetalhe} onUnauthorized={onUnauthorized} refreshKey={refreshKey} /></div>
      </section>

      {cadastroAberto ? (
        <PhotoUploadDialog
          onClose={fecharCadastro}
          onSaved={registrarFoto}
          onUnauthorized={onUnauthorized}
          onRefresh={recarregar}
        />
      ) : null}

      {selecao ? (
        <MemoryDetailDialog
          fotoIds={selecao.fotoIds}
          indiceInicial={selecao.indice}
          opener={selecao.opener}
          onClose={fecharDetalhe}
          onUnauthorized={onUnauthorized}
        />
      ) : null}
    </section>
  );
}
