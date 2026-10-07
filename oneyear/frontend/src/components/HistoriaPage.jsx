import { useCallback, useEffect, useState } from "react";
import GalleryVerticalEnd from "lucide-react/dist/esm/icons/gallery-vertical-end";
import Heart from "lucide-react/dist/esm/icons/heart";
import ImageOff from "lucide-react/dist/esm/icons/image-off";
import MapPin from "lucide-react/dist/esm/icons/map-pin";
import Plus from "lucide-react/dist/esm/icons/plus";
import RotateCcw from "lucide-react/dist/esm/icons/rotate-ccw";
import * as api from "../api";
import Button from "./Button";

const orientacoesPadrao = [
  { titulo: "Explore a galeria", texto: "Veja as fotos reunidas em um só lugar.", Icon: GalleryVerticalEnd },
  { titulo: "Adicione fotos", texto: "O cadastro ficará acessível pela galeria.", Icon: Plus },
  { titulo: "Encontre no mapa", texto: "Memórias com localização recebem um coração.", Icon: MapPin },
];

const formatarData = (data) => data
  ? new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${data}T00:00:00Z`))
  : "";

function HistoriaSkeleton() {
  return (
    <section className="story-page story-skeleton" aria-busy="true" aria-label="Carregando história">
      <div className="skeleton skeleton--title" />
      <div className="skeleton skeleton--text" />
      <div className="skeleton skeleton--media" />
    </section>
  );
}

export default function HistoriaPage({ onGallery, onUnauthorized }) {
  const [estado, setEstado] = useState({ dados: null, carregando: true, erro: "" });
  const [imagensFalhas, setImagensFalhas] = useState([]);

  const carregar = useCallback(async () => {
    setEstado((anterior) => ({ ...anterior, carregando: !anterior.dados, erro: "" }));
    try {
      const dados = await api.obterHistoria();
      setEstado({ dados, carregando: false, erro: "" });
    } catch (erro) {
      if (erro instanceof api.ApiError && erro.status === 401) {
        onUnauthorized();
        return;
      }
      setEstado((anterior) => ({ ...anterior, carregando: false, erro: "Não foi possível carregar a história." }));
    }
  }, [onUnauthorized]);

  useEffect(() => {
    let ativo = true;
    queueMicrotask(() => {
      if (ativo) carregar();
    });
    return () => { ativo = false; };
  }, [carregar]);

  if (estado.carregando && !estado.dados) return <HistoriaSkeleton />;
  if (!estado.dados) {
    return (
      <section className="story-page story-failure" role="alert">
        <h1>Não foi possível carregar a história.</h1>
        <p>Confira a conexão e tente novamente.</p>
        <Button type="button" variant="outline" onClick={carregar}><RotateCcw size={18} /> Tentar novamente</Button>
      </section>
    );
  }

  const { frasePrincipal, introducao, secoes = [], dicas = [] } = estado.dados;
  const historiaVazia = !frasePrincipal?.trim() && !introducao?.trim() && secoes.length === 0;

  return (
    <article className="story-page">
      {estado.erro ? (
        <div className="story-warning" role="alert">
          <span>{estado.erro} O conteúdo anterior foi preservado.</span>
          <button type="button" onClick={carregar}>Tentar novamente</button>
        </div>
      ) : null}

      <header className="story-hero">
        <div className="story-hero-copy">
          <h1>{frasePrincipal?.trim() || "Nossa história"}</h1>
          <p>{introducao?.trim() || "O conteúdo privado ainda não foi configurado."}</p>
        </div>
        <div className="story-hero-art" aria-hidden="true">
          <img src="/login-memories.png" alt="" />
        </div>
      </header>

      <section className="timeline" aria-labelledby="timeline-title">
        <h2 id="timeline-title">Nossa história</h2>
        {secoes.length ? (
          <ol>
            {secoes.map((secao, indice) => {
              const chave = secao.id || `${secao.ordem}-${indice}`;
              const imagemFalhou = imagensFalhas.includes(chave);
              return (
                <li key={chave} className={indice % 2 ? "timeline-item timeline-item--reverse" : "timeline-item"}>
                  <span className="timeline-marker" aria-hidden="true"><Heart size={16} fill="currentColor" /></span>
                  <div className="timeline-copy">
                    {secao.data ? <time dateTime={secao.data}>{formatarData(secao.data)}</time> : null}
                    <h3>{secao.titulo}</h3>
                    <p>{secao.texto}</p>
                  </div>
                  {secao.fotoId ? (
                    <div className="timeline-media">
                      {imagemFalhou ? (
                        <div className="image-fallback" role="status"><ImageOff size={32} /><span>Imagem indisponível</span></div>
                      ) : (
                        <img
                          src={api.urlDaApi(`/api/v1/fotos/${secao.fotoId}/arquivo`)}
                          alt=""
                          loading="lazy"
                          onError={() => setImagensFalhas((atuais) => [...atuais, chave])}
                        />
                      )}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="story-empty" role="status">
            <Heart size={42} aria-hidden="true" />
            <h3>{historiaVazia ? "Sua história está pronta para começar." : "Nenhuma seção foi configurada."}</h3>
            <p>Os textos continuarão disponíveis mesmo quando uma seção não tiver foto.</p>
          </div>
        )}
      </section>

      <section className="story-guide" aria-labelledby="guide-title">
        <h2 id="guide-title">Como usar este espaço</h2>
        <div className="guide-grid">
          {orientacoesPadrao.map(({ titulo, texto, Icon }) => (
            <div key={titulo} className="guide-item">
              <Icon size={28} aria-hidden="true" />
              <h3>{titulo}</h3>
              <p>{texto}</p>
            </div>
          ))}
        </div>
        {dicas.length ? <ul className="story-tips">{dicas.map((dica) => <li key={dica}>{dica}</li>)}</ul> : null}
      </section>

      <section className="memory-map" aria-labelledby="map-title">
        <div className="section-heading">
          <h2 id="map-title">Mapa das memórias</h2>
          <p>As memórias com localização serão reunidas aqui.</p>
        </div>
        <div className="map-layout">
          <div className="map-preview" role="img" aria-label="Espaço reservado para o mapa das memórias">
            <img src="/login-memories.png" alt="" />
          </div>
          <div className="memory-list">
            <h3>Lista de memórias</h3>
            <div className="memory-list-empty" role="status">
              <MapPin size={30} aria-hidden="true" />
              <p>Nenhuma memória localizada por enquanto.</p>
              <Button type="button" variant="outline" onClick={onGallery}>Abrir galeria</Button>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
