import { useEffect, useMemo, useRef, useState } from "react";
import MapPin from "lucide-react/dist/esm/icons/map-pin";
import RotateCcw from "lucide-react/dist/esm/icons/rotate-ccw";
import "leaflet/dist/leaflet.css";
import * as api from "../api";
import { agruparPinsCoincidentes, formatarData, nomeDoLugar } from "../memory";
import Button from "./Button";

const ICONE_CORACAO = `
  <span class="memory-heart-shape" aria-hidden="true">
    <svg viewBox="0 0 24 24"><path d="M12 21s-7.4-4.5-9.6-9C.8 8.7 2.4 5 6.1 4.3c2.2-.4 4.3.6 5.9 2.5 1.6-1.9 3.7-2.9 5.9-2.5 3.7.7 5.3 4.4 3.7 7.7C19.4 16.5 12 21 12 21Z"/></svg>
  </span>`;

export default function MemoryMap({ onSelect, onUnauthorized, refreshKey = 0, compact = false, onGallery }) {
  const [consulta, setConsulta] = useState({ estado: "carregando", pins: [] });
  const [provedorFalhou, setProvedorFalhou] = useState(false);
  const mapaElementoRef = useRef(null);
  const camadaTilesRef = useRef(null);
  const onSelectRef = useRef(onSelect);
  const grupos = useMemo(() => agruparPinsCoincidentes(consulta.pins), [consulta.pins]);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  const carregar = async () => {
    setConsulta((atual) => ({ ...atual, estado: "carregando" }));
    try {
      const pins = await api.listarTodosPins();
      setConsulta({ estado: "pronto", pins });
    } catch (erro) {
      if (erro instanceof api.ApiError && erro.status === 401) onUnauthorized();
      else setConsulta((atual) => ({ ...atual, estado: "erro" }));
    }
  };

  useEffect(() => {
    let ativo = true;
    api.listarTodosPins().then((pins) => {
      if (ativo) setConsulta({ estado: "pronto", pins });
    }).catch((erro) => {
      if (!ativo) return;
      if (erro instanceof api.ApiError && erro.status === 401) onUnauthorized();
      else setConsulta({ estado: "erro", pins: [] });
    });
    return () => { ativo = false; };
  }, [onUnauthorized, refreshKey]);

  useEffect(() => {
    if (consulta.estado !== "pronto" || grupos.length === 0 || !mapaElementoRef.current) return undefined;
    let cancelado = false;
    let mapa;
    let limiteDeEspera;
    import("leaflet").then(({ default: L }) => {
      if (cancelado) return;
      const ponteiroGrosso = window.matchMedia("(pointer: coarse)").matches;
      mapa = L.map(mapaElementoRef.current, {
        attributionControl: true,
        zoomControl: true,
        scrollWheelZoom: false,
        dragging: !ponteiroGrosso,
        touchZoom: true,
      });
      const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      });
      let houveFalha = false;
      limiteDeEspera = window.setTimeout(() => setProvedorFalhou(true), 8000);
      tiles.on("loading", () => {
        houveFalha = false;
        setProvedorFalhou(false);
      });
      tiles.on("tileerror", () => {
        houveFalha = true;
        window.clearTimeout(limiteDeEspera);
        setProvedorFalhou(true);
      });
      tiles.on("load", () => {
        window.clearTimeout(limiteDeEspera);
        if (!houveFalha) setProvedorFalhou(false);
      });
      tiles.addTo(mapa);
      camadaTilesRef.current = tiles;

      const limites = [];
      for (const grupo of grupos) {
        const ids = grupo.pins.map((pin) => pin.fotoId);
        const quantidade = grupo.pins.length;
        const html = `${ICONE_CORACAO}${quantidade > 1 ? `<span class="memory-heart-count">${quantidade}</span>` : ""}`;
        const icon = L.divIcon({ className: "memory-heart-marker", html, iconSize: [46, 46], iconAnchor: [23, 42] });
        const marker = L.marker([grupo.latitude, grupo.longitude], {
          icon,
          keyboard: true,
          title: quantidade > 1 ? `${quantidade} memórias neste lugar` : nomeDoLugar(grupo.pins[0]),
        }).addTo(mapa);
        marker.on("click", () => onSelectRef.current(ids, 0, marker.getElement()));
        marker.on("add", () => {
          const elemento = marker.getElement();
          if (!elemento) return;
          elemento.setAttribute("role", "button");
          elemento.setAttribute("aria-label", marker.options.title);
          elemento.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onSelectRef.current(ids, 0, elemento);
            }
          });
        });
        limites.push([grupo.latitude, grupo.longitude]);
      }
      if (limites.length === 1) mapa.setView(limites[0], 12);
      else mapa.fitBounds(limites, { padding: [36, 36], maxZoom: 13 });
    }).catch(() => setProvedorFalhou(true));
    return () => {
      cancelado = true;
      window.clearTimeout(limiteDeEspera);
      camadaTilesRef.current = null;
      mapa?.remove();
    };
  }, [consulta.estado, grupos]);

  if (consulta.estado === "carregando") {
    return <div className="map-loading" aria-busy="true"><span className="spinner" /><p>Carregando lugares…</p></div>;
  }

  if (consulta.estado === "erro") {
    return (
      <div className="map-data-error" role="alert">
        <MapPin size={38} />
        <p>Não foi possível carregar as memórias localizadas.</p>
        <Button type="button" variant="outline" onClick={carregar}><RotateCcw size={18} /> Tentar novamente</Button>
        {onGallery ? <Button type="button" variant="outline" onClick={onGallery}>Abrir galeria</Button> : null}
      </div>
    );
  }

  if (consulta.pins.length === 0) {
    return (
      <div className="map-empty" role="status">
        <MapPin size={40} />
        <h3>Nenhuma memória localizada por enquanto.</h3>
        <p>Fotos sem GPS continuam disponíveis na galeria.</p>
        {onGallery ? <Button type="button" variant="outline" onClick={onGallery}>Abrir galeria</Button> : null}
      </div>
    );
  }

  return (
    <div className={`real-map-layout ${compact ? "real-map-layout--compact" : ""}`}>
      <div className="real-map-stage">
        <div ref={mapaElementoRef} className="leaflet-memory-map" role="region" aria-label="Mapa geográfico das memórias localizadas" />
        {provedorFalhou ? (
          <div className="map-provider-error" role="alert">
            <span>O mapa base não carregou. A lista continua disponível.</span>
            <button type="button" onClick={() => { setProvedorFalhou(false); camadaTilesRef.current?.redraw(); }}>
              Tentar mapa novamente
            </button>
          </div>
        ) : null}
      </div>
      <aside className="located-memories" aria-label="Lista alternativa de memórias localizadas">
        <h3>Memórias no mapa <span>({consulta.pins.length})</span></h3>
        <ul>
          {grupos.map((grupo) => {
            const ids = grupo.pins.map((pin) => pin.fotoId);
            return grupo.pins.map((pin, indice) => (
              <li key={pin.fotoId}>
                <button type="button" onClick={(event) => onSelect(ids, indice, event.currentTarget)}>
                  <span className="located-memory-icon"><MapPin size={17} /></span>
                  <span><strong>{nomeDoLugar(pin)}</strong><small>{formatarData(pin.dataCaptura)}</small></span>
                  {grupo.pins.length > 1 ? <em>{indice + 1}/{grupo.pins.length}</em> : null}
                </button>
              </li>
            ));
          })}
        </ul>
      </aside>
    </div>
  );
}
