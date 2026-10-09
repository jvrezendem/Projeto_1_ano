import { useEffect, useRef, useState } from "react";
import CalendarDays from "lucide-react/dist/esm/icons/calendar-days";
import ChevronLeft from "lucide-react/dist/esm/icons/chevron-left";
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right";
import ImageOff from "lucide-react/dist/esm/icons/image-off";
import MapPin from "lucide-react/dist/esm/icons/map-pin";
import RotateCcw from "lucide-react/dist/esm/icons/rotate-ccw";
import Trash2 from "lucide-react/dist/esm/icons/trash-2";
import X from "lucide-react/dist/esm/icons/x";
import * as api from "../api";
import { formatarData, nomeDoLugar } from "../memory";
import Button from "./Button";

const EXCLUSAO_INICIAL = { confirmando: false, enviando: false, erro: "" };

export default function MemoryDetailDialog({ fotoIds, indiceInicial = 0, opener, onClose, onDeleted, onUnauthorized }) {
  const dialogRef = useRef(null);
  const confirmacaoRef = useRef(null);
  const [indice, setIndice] = useState(indiceInicial);
  const [consulta, setConsulta] = useState({ estado: "carregando", foto: null });
  const [tentativa, setTentativa] = useState(0);
  const [imagemFalhou, setImagemFalhou] = useState(false);
  const [exclusao, setExclusao] = useState(EXCLUSAO_INICIAL);
  const idAtual = fotoIds[indice];

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    dialog.addEventListener("close", onClose);
    return () => {
      dialog.removeEventListener("close", onClose);
      opener?.focus?.();
    };
  }, [onClose, opener]);

  useEffect(() => {
    if (exclusao.confirmando) confirmacaoRef.current?.focus();
  }, [exclusao.confirmando]);

  useEffect(() => {
    let ativo = true;
    api.obterFoto(idAtual).then((foto) => {
      if (ativo) setConsulta({ estado: "pronto", foto });
    }).catch((erro) => {
      if (!ativo) return;
      if (erro instanceof api.ApiError && erro.status === 401) onUnauthorized();
      else setConsulta({ estado: "erro", foto: null });
    });
    return () => { ativo = false; };
  }, [idAtual, onUnauthorized, tentativa]);

  const navegar = (direcao) => {
    setConsulta({ estado: "carregando", foto: null });
    setImagemFalhou(false);
    setExclusao(EXCLUSAO_INICIAL);
    setIndice((atual) => (atual + direcao + fotoIds.length) % fotoIds.length);
  };

  const tentarNovamente = () => {
    setConsulta({ estado: "carregando", foto: null });
    setTentativa((valor) => valor + 1);
  };

  const excluirMemoria = async () => {
    setExclusao((atual) => ({ ...atual, enviando: true, erro: "" }));
    try {
      await api.excluirFoto(idAtual);
      if (onDeleted) onDeleted(idAtual);
      else dialogRef.current?.close();
    } catch (erro) {
      if (erro instanceof api.ApiError && erro.status === 401) {
        onUnauthorized();
        return;
      }
      setExclusao((atual) => ({ ...atual, enviando: false, erro: "Não foi possível apagar esta memória. Tente novamente." }));
    }
  };

  const foto = consulta.foto;
  return (
    <dialog ref={dialogRef} className="memory-dialog" aria-labelledby="memory-dialog-title">
      <div className="memory-dialog-inner">
        <header className="memory-dialog-header">
          <div>
            <h2 id="memory-dialog-title">Memória</h2>
            {fotoIds.length > 1 ? <p>{indice + 1} de {fotoIds.length} neste lugar</p> : null}
          </div>
          <button className="dialog-close" type="button" aria-label="Fechar memória" onClick={() => dialogRef.current?.close()}>
            <X />
          </button>
        </header>

        {consulta.estado === "carregando" ? (
          <div className="memory-detail-status" aria-busy="true"><span className="spinner" /><p>Carregando memória…</p></div>
        ) : null}

        {consulta.estado === "erro" ? (
          <div className="memory-detail-status" role="alert">
            <ImageOff size={42} />
            <p>Não foi possível carregar esta memória.</p>
            <Button type="button" variant="outline" onClick={tentarNovamente}>
              <RotateCcw size={18} /> Tentar novamente
            </Button>
          </div>
        ) : null}

        {consulta.estado === "pronto" && foto ? (
          <div className="memory-detail">
            <div className="memory-detail-media">
              {imagemFalhou ? (
                <div className="photo-fallback" role="status">
                  <ImageOff />
                  <span>Imagem indisponível</span>
                  <button type="button" onClick={() => setImagemFalhou(false)}><RotateCcw size={16} /> Tentar novamente</button>
                </div>
              ) : (
                <img src={api.urlDaApi(foto.arquivoUrl)} alt={foto.legenda || "Foto da memória"} onError={() => setImagemFalhou(true)} />
              )}
              {fotoIds.length > 1 ? (
                <div className="memory-stepper" aria-label="Memórias neste lugar">
                  <button type="button" aria-label="Memória anterior" onClick={() => navegar(-1)}><ChevronLeft /></button>
                  <button type="button" aria-label="Próxima memória" onClick={() => navegar(1)}><ChevronRight /></button>
                </div>
              ) : null}
            </div>
            <div className="memory-detail-copy">
              {foto.legenda ? <p className="memory-caption">{foto.legenda}</p> : null}
              <p><MapPin aria-hidden="true" /> <span>{nomeDoLugar(foto)}</span></p>
              <p><CalendarDays aria-hidden="true" /> <span>{formatarData(foto.dataCaptura)}</span></p>
              <div className="memory-delete-zone">
                {exclusao.confirmando ? (
                  <div className="memory-delete-confirmation" role="alert" aria-live="assertive">
                    <strong>Apagar esta memória?</strong>
                    <p>A foto e suas informações serão removidas permanentemente.</p>
                    {exclusao.erro ? <span className="field-error">{exclusao.erro}</span> : null}
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={exclusao.enviando}
                        onClick={() => setExclusao(EXCLUSAO_INICIAL)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        ref={confirmacaoRef}
                        type="button"
                        className="memory-delete-confirm"
                        loading={exclusao.enviando}
                        onClick={excluirMemoria}
                      >
                        <Trash2 size={17} /> Apagar definitivamente
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="memory-delete-trigger"
                    type="button"
                    onClick={() => setExclusao({ confirmando: true, enviando: false, erro: "" })}
                  >
                    <Trash2 size={17} /> Apagar memória
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </dialog>
  );
}
