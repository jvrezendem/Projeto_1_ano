import { useCallback, useEffect, useState } from "react";
import ArrowDown from "lucide-react/dist/esm/icons/arrow-down";
import ArrowUpRight from "lucide-react/dist/esm/icons/arrow-up-right";
import Camera from "lucide-react/dist/esm/icons/camera";
import Compass from "lucide-react/dist/esm/icons/compass";
import GalleryVerticalEnd from "lucide-react/dist/esm/icons/gallery-vertical-end";
import Heart from "lucide-react/dist/esm/icons/heart";
import ImageOff from "lucide-react/dist/esm/icons/image-off";
import Plus from "lucide-react/dist/esm/icons/plus";
import RotateCcw from "lucide-react/dist/esm/icons/rotate-ccw";
import * as api from "../api";
import Button from "./Button";
import MemoryDetailDialog from "./MemoryDetailDialog";
import MemoryMap from "./MemoryMap";
import { Skeleton } from "@/components/ui/skeleton";

const orientacoesPadrao = [
  { titulo: "Encontre um lugar", texto: "Navegue pelo mapa e encontre as memórias que ganharam um lugar no mundo.", Icon: Compass },
  { titulo: "Guarde uma lembrança", texto: "Adicione novas fotos e complete os detalhes que tornam cada instante único.", Icon: Plus },
  { titulo: "Siga o fio da história", texto: "Percorra a galeria em ordem cronológica e volte aos capítulos que importam.", Icon: GalleryVerticalEnd },
];

const fotosDeAssets = {
  principal: {
    src: "/assets/fotos/historia/destaque-principal.jpg",
    caminho: "public/assets/fotos/historia/destaque-principal.jpg",
  },
  polaroid: {
    src: "/assets/fotos/historia/destaque-polaroid.jpg",
    caminho: "public/assets/fotos/historia/destaque-polaroid.jpg",
  },
};

const formatarData = (data) => data
  ? new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${data}T00:00:00Z`))
  : "";

function TituloDestacado({ children }) {
  const texto = String(children || "Nossa história").trim();
  const partes = texto.split(/\s+/);
  const destaque = partes.pop();
  return <>{partes.join(" ")} {destaque ? <em>{destaque}</em> : null}</>;
}

function HistoriaSkeleton() {
  return (
    <section className="story-page story-skeleton" aria-busy="true" aria-label="Carregando história">
      <Skeleton className="skeleton skeleton--title" />
      <Skeleton className="skeleton skeleton--text" />
      <Skeleton className="skeleton skeleton--media" />
    </section>
  );
}

export default function HistoriaPage({ onGallery, onUnauthorized }) {
  const [estado, setEstado] = useState({ dados: null, carregando: true, erro: "" });
  const [imagensFalhas, setImagensFalhas] = useState([]);
  const [selecao, setSelecao] = useState(null);
  const [mapRefreshKey, setMapRefreshKey] = useState(0);
  const abrirDetalhe = useCallback((fotoIds, indice, opener) => setSelecao({ fotoIds, indice, opener }), []);
  const fecharDetalhe = useCallback(() => setSelecao(null), []);
  const registrarExclusao = useCallback((fotoId) => {
    setSelecao(null);
    setEstado((atual) => ({
      ...atual,
      dados: atual.dados ? {
        ...atual.dados,
        secoes: (atual.dados.secoes || []).map((secao) => secao.fotoId === fotoId ? { ...secao, fotoId: null } : secao),
      } : atual.dados,
    }));
    setMapRefreshKey((valor) => valor + 1);
  }, []);

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
    queueMicrotask(() => { if (ativo) carregar(); });
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

  const renderFotoDeAsset = (tipo, className, alt) => {
    const asset = fotosDeAssets[tipo];
    const assetFalhou = imagensFalhas.includes(asset.src);
    const conteudo = !assetFalhou ? (
      <img
        src={asset.src}
        alt={alt}
        loading={className.includes("hero-photo-main") ? "eager" : "lazy"}
        onError={() => setImagensFalhas((atuais) => atuais.includes(asset.src) ? atuais : [...atuais, asset.src])}
      />
    ) : (
      <span className="asset-photo-placeholder">
        <Camera size={className.includes("hero-photo-main") ? 30 : 20} />
        <strong>Adicione sua foto aqui</strong>
        <code>{asset.caminho}</code>
      </span>
    );

    return <div className={className}>{conteudo}</div>;
  };

  return (
    <article className="story-page">
      {estado.erro ? (
        <div className="story-warning" role="alert">
          <span>{estado.erro} O conteúdo anterior foi preservado.</span>
          <button type="button" onClick={carregar}>Tentar novamente</button>
        </div>
      ) : null}

      <header className="story-hero section-wrap" data-reveal="hero">
        <div className="story-hero-copy">
          <span className="eyebrow">365 DIAS. CONTANDO...</span>
          <h1><TituloDestacado>{frasePrincipal?.trim() || "De todos os lugares, o meu favorito é com você."}</TituloDestacado></h1>
          <p>{introducao?.trim() || "Bom, e já se passaram um ano, um ano em que tomamos uma decisão que mudaria nossas vidas. Quero agradecer por cada momento ao seu lado, cada momento em que eu precisava de alguém e você estava lá, cada sorriso, cada abraço, cada olhar, cada gesto de amor e carinho. Por isso decide por guardar todos esses momentos. Te amo muito!!! "}<br /> {"PS: Dá pra atualizar essa frase depois"}</p>
          <Button type="button" onClick={() => document.getElementById("nossa-historia")?.scrollIntoView({ behavior: "smooth" })}>
            Explorar nossas memórias <ArrowDown size={17} />
          </Button>
        </div>

        <div className="hero-collage">
          {renderFotoDeAsset("principal", "hero-photo-main", "Foto em destaque da história")}
          {renderFotoDeAsset("polaroid", "hero-photo-small", "Foto em formato polaroid da história")}
          <span className="handwritten" aria-hidden="true">o nosso lugar<br />é juntos.</span>
          <svg className="orbit-line" viewBox="0 0 500 560" aria-hidden="true"><path d="M60 460C-90 260 230-60 423 72S565 396 338 524" /><path d="m328 516 10 8 12-6" /></svg>
        </div>

        <div className="hero-bottom">
          <a href="#nossa-historia"><span className="scroll-line" /> Continue a história <ArrowDown size={14} /></a>
        </div>
      </header>

      <section className="story-intro section-wrap" aria-labelledby="story-intro-title">
        <div data-reveal="left">
          <span className="eyebrow">O QUE NOS TROUXE ATÉ AQUI</span>
          <h2 id="story-intro-title">Esse é mais do que<br />um presente.<br /><em>é a nossa história.</em></h2>
        </div>
        <div className="story-intro-copy" data-reveal="right">
          <Heart size={54} strokeWidth={1} aria-hidden="true" />
          <p>{introducao?.trim() || "Tem dias que nunca devem ser esquecidos."}</p>
          <button className="text-link" type="button" onClick={onGallery}>Percorrer todas as memórias <ArrowUpRight size={17} /></button>
        </div>
      </section>

      <section className="timeline section-wrap" id="nossa-historia" aria-labelledby="timeline-title">
        <div className="timeline-heading" data-reveal="up">
          <span className="eyebrow"></span>
          <h2 id="timeline-title">O porquê <em>disso?</em></h2>
          <p>Dessa vez, pra comemorar um marco tão importante, eu quis me esforçar um pouco mais.<br />Crie um presente que vamos construir juntos!</p>
        </div>

        {secoes.length ? (
          <ol>
            {secoes.map((secao, indice) => {
              const chave = secao.id || `${secao.ordem}-${indice}`;
              const imagemFalhou = imagensFalhas.includes(chave);
              return (
                <li key={chave} className="timeline-item" data-reveal={indice % 2 ? "right" : "left"} style={{ "--reveal-delay": `${Math.min(indice, 4) * 70}ms` }}>
                  <span className="timeline-marker" aria-hidden="true" />
                  <div className="timeline-copy">
                    <span className="chapter-number">{String(indice + 1).padStart(2, "0")} / NOSSA HISTÓRIA</span>
                    {secao.data ? <time dateTime={secao.data}>{formatarData(secao.data)}</time> : null}
                    <h3>{secao.titulo}</h3>
                    <p>{secao.texto}</p>
                    {secao.fotoId ? (
                      <button className="text-link" type="button" onClick={(event) => abrirDetalhe([secao.fotoId], 0, event.currentTarget)}>
                        Revisitar esse instante <ArrowUpRight size={17} />
                      </button>
                    ) : null}
                  </div>
                  {secao.fotoId ? (
                    <button className="timeline-media" type="button" aria-label={`Abrir memória ${secao.titulo}`} onClick={(event) => abrirDetalhe([secao.fotoId], 0, event.currentTarget)}>
                      {imagemFalhou ? (
                        <span className="image-fallback" role="status"><ImageOff size={32} /><span>Imagem indisponível</span></span>
                      ) : (
                        <img
                          src={api.urlDaApi(`/api/v1/fotos/${secao.fotoId}/arquivo`)}
                          alt=""
                          loading="lazy"
                          onError={() => setImagensFalhas((atuais) => atuais.includes(chave) ? atuais : [...atuais, chave])}
                        />
                      )}
                      <span className="timeline-place"><Camera size={16} /> {secao.titulo} <ArrowUpRight size={18} /></span>
                    </button>
                  ) : <div className="timeline-media timeline-media--empty"><Heart size={44} aria-hidden="true" /></div>}
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

      <section className="story-guide section-wrap" aria-labelledby="guide-title">
        <div className="guide-heading" data-reveal="up">
          <span className="eyebrow">PARA EXPLORAR SEM PRESSA</span>
          <h2 id="guide-title">Usar é <em>simples.</em></h2>
        </div>
        <div className="guide-grid">
          {orientacoesPadrao.map(({ titulo, texto, Icon }, indice) => (
            <article key={titulo} className="guide-item" data-reveal="up" style={{ "--reveal-delay": `${indice * 90}ms` }}>
              <div><span>0{indice + 1}</span><Icon size={23} aria-hidden="true" /></div>
              <h3>{titulo}</h3>
              <p>{texto}</p>
            </article>
          ))}
        </div>
        {dicas.length ? <ul className="story-tips">{dicas.map((dica) => <li key={dica}>{dica}</li>)}</ul> : null}
      </section>

      <section className="memory-map section-wrap" aria-labelledby="map-title">
        <div className="section-heading" data-reveal="up">
          <div><span className="eyebrow">NOSSO MAPA</span><h2 id="map-title">O mundo é muito grande.<br />Mas, a gente <em>conquista juntos.</em></h2></div>
          <p>Cada um desses pontos é uma lembrança. Selecione um lugar para voltar àquele momento.</p>
        </div>
        <div data-reveal="scale"><MemoryMap compact onSelect={abrirDetalhe} onUnauthorized={onUnauthorized} onGallery={onGallery} refreshKey={mapRefreshKey} /></div>
      </section>

      <section className="story-closing section-wrap" data-reveal="up">
        <span className="eyebrow">E AINDA TEM TANTO PELA FRENTE</span>
        <h2>O próximo capítulo?<br /><em>Com você.</em></h2>
        <Button type="button" onClick={onGallery}>Percorrer a galeria <ArrowUpRight size={17} /></Button>
        <span className="closing-script" aria-hidden="true">continua...</span>
      </section>

      {selecao ? (
        <MemoryDetailDialog
          fotoIds={selecao.fotoIds}
          indiceInicial={selecao.indice}
          opener={selecao.opener}
          onClose={fecharDetalhe}
          onDeleted={registrarExclusao}
          onUnauthorized={onUnauthorized}
        />
      ) : null}
    </article>
  );
}
