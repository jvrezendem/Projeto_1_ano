import { useEffect, useRef, useState } from "react";
import AlertCircle from "lucide-react/dist/esm/icons/circle-alert";
import CheckCircle2 from "lucide-react/dist/esm/icons/circle-check-big";
import ImagePlus from "lucide-react/dist/esm/icons/image-plus";
import LoaderCircle from "lucide-react/dist/esm/icons/loader-circle";
import X from "lucide-react/dist/esm/icons/x";
import * as api from "../api";
import { prepararMetadados, validarArquivoFoto, valoresDaFoto } from "../photoForm";
import Button from "./Button";

const valoresVazios = { legenda: "", lugar: "", latitude: "", longitude: "", dataCaptura: "" };

export default function PhotoUploadDialog({ onClose, onSaved, onUnauthorized, onRefresh }) {
  const dialogRef = useRef(null);
  const [arquivo, setArquivo] = useState(null);
  const [preview, setPreview] = useState("");
  const [foto, setFoto] = useState(null);
  const [valores, setValores] = useState(valoresVazios);
  const [erros, setErros] = useState({});
  const [mensagem, setMensagem] = useState("");
  const [estado, setEstado] = useState("selecionar");

  const ocupado = estado === "enviando" || estado === "salvando";

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const fechar = () => {
    if (ocupado) return;
    dialogRef.current?.close();
    onClose();
  };

  const selecionarArquivo = (event) => {
    const proximo = event.target.files?.[0];
    const erro = validarArquivoFoto(proximo);
    if (preview) URL.revokeObjectURL(preview);
    setErros(erro ? { arquivo: erro } : {});
    setMensagem("");
    setArquivo(erro ? null : proximo);
    setPreview(erro ? "" : URL.createObjectURL(proximo));
    setEstado("selecionar");
  };

  const tratarErro = (erro, contexto) => {
    if (erro instanceof api.ApiError && erro.status === 401) {
      onUnauthorized();
      fechar();
      return;
    }
    setMensagem(erro.message || contexto);
  };

  const enviar = async () => {
    const erro = validarArquivoFoto(arquivo);
    if (erro) {
      setErros({ arquivo: erro });
      return;
    }
    setEstado("enviando");
    setMensagem("");
    try {
      const cadastrada = await api.cadastrarFoto(arquivo);
      setFoto(cadastrada);
      setValores(valoresDaFoto(cadastrada));
      setEstado("revisar");
      onSaved(cadastrada, "Foto enviada. Revise os dados extraídos.");
    } catch (erroApi) {
      setEstado("selecionar");
      if (!(erroApi instanceof api.ApiError)) {
        onRefresh();
        setMensagem("A resposta do envio não chegou. A galeria foi consultada; confira-a antes de tentar novamente.");
      } else {
        tratarErro(erroApi, "Não foi possível enviar a foto.");
      }
    }
  };

  const alterar = (event) => {
    const { name, value } = event.target;
    setValores((atuais) => ({ ...atuais, [name]: value }));
    setErros((atuais) => {
      const proximos = { ...atuais };
      delete proximos[name];
      if (name === "latitude" || name === "longitude") delete proximos.coordenadas;
      return proximos;
    });
  };

  const salvar = async (event) => {
    event.preventDefault();
    const resultado = prepararMetadados(valores);
    if (Object.keys(resultado.erros).length) {
      setErros(resultado.erros);
      return;
    }
    setErros({});
    setMensagem("");
    setEstado("salvando");
    try {
      const atualizada = await api.atualizarFoto(foto.id, resultado.dados);
      onSaved(atualizada, "Memória salva na galeria.");
      setEstado("concluido");
    } catch (erroApi) {
      setEstado("revisar");
      tratarErro(erroApi, "Não foi possível salvar os dados.");
      if (erroApi instanceof api.ApiError) setErros(erroApi.campos);
    }
  };

  const status = (origem, ausente) => origem === "EXIF" ? "Extraído dos dados da foto" : ausente;

  return (
    <dialog
      ref={dialogRef}
      className="photo-dialog"
      aria-labelledby="photo-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        fechar();
      }}
    >
      <div className="photo-dialog-inner">
        <button className="dialog-close" type="button" aria-label="Fechar cadastro" disabled={ocupado} onClick={fechar}>
          <X aria-hidden="true" />
        </button>

        {estado === "concluido" ? (
          <div className="upload-complete" role="status">
            <CheckCircle2 size={52} aria-hidden="true" />
            <h2 id="photo-dialog-title">Memória salva</h2>
            <p>A foto e os dados já estão disponíveis na coleção compartilhada.</p>
            <Button type="button" onClick={fechar}>Voltar para a galeria</Button>
          </div>
        ) : null}

        {estado !== "concluido" ? <h2 id="photo-dialog-title">{foto ? "Revisar memória" : "Adicionar foto"}</h2> : null}

        {!foto && estado !== "concluido" ? (
          <div className="upload-step">
            <label className="upload-dropzone">
              <ImagePlus size={42} aria-hidden="true" />
              <strong>Escolher foto</strong>
              <span>JPEG ou PNG, até 15 MiB</span>
              <input type="file" accept="image/jpeg,image/png" onChange={selecionarArquivo} />
            </label>
            {erros.arquivo ? <p className="form-error" role="alert">{erros.arquivo}</p> : null}
            {preview ? (
              <div className="selected-photo">
                <img src={preview} alt="Prévia da foto selecionada" />
                <div><strong>{arquivo.name}</strong><span>{(arquivo.size / 1024 / 1024).toFixed(2)} MiB</span></div>
              </div>
            ) : null}
            <p className="upload-note">O arquivo original será enviado para preservar os metadados da imagem.</p>
            {mensagem ? <div className="form-alert" role="alert"><AlertCircle /><p>{mensagem}</p></div> : null}
            <div className="dialog-actions">
              <Button type="button" variant="outline" disabled={ocupado} onClick={fechar}>Cancelar</Button>
              <Button type="button" disabled={!arquivo || ocupado} onClick={enviar}>
                {estado === "enviando" ? <><LoaderCircle className="spin" /> Enviando…</> : "Enviar foto"}
              </Button>
            </div>
          </div>
        ) : null}

        {foto && estado !== "concluido" ? (
          <form className="review-form" onSubmit={salvar} noValidate>
            <img className="review-preview" src={preview} alt="Foto enviada para revisão" />

            <label className="form-field">
              <span>Legenda</span>
              <textarea name="legenda" maxLength="500" rows="3" value={valores.legenda} onChange={alterar} aria-invalid={Boolean(erros.legenda)} />
              {erros.legenda ? <small className="form-error">{erros.legenda}</small> : null}
            </label>
            <label className="form-field">
              <span>Lugar</span>
              <input name="lugar" maxLength="120" value={valores.lugar} onChange={alterar} />
              {erros.lugar ? <small className="form-error">{erros.lugar}</small> : null}
            </label>
            <div className="coordinate-fields">
              <label className="form-field">
                <span>Latitude</span>
                <input name="latitude" inputMode="decimal" placeholder="Ex.: -23.5505" value={valores.latitude} onChange={alterar} aria-invalid={Boolean(erros.latitude || erros.coordenadas)} />
                <small className="metadata-status">{status(foto.origemLocalizacao, "Não encontrada na foto")}</small>
                {erros.latitude ? <small className="form-error">{erros.latitude}</small> : null}
              </label>
              <label className="form-field">
                <span>Longitude</span>
                <input name="longitude" inputMode="decimal" placeholder="Ex.: -46.6333" value={valores.longitude} onChange={alterar} aria-invalid={Boolean(erros.longitude || erros.coordenadas)} />
                <small className="metadata-status">{status(foto.origemLocalizacao, "Não encontrada na foto")}</small>
                {erros.longitude ? <small className="form-error">{erros.longitude}</small> : null}
              </label>
            </div>
            {erros.coordenadas ? <p className="form-error" role="alert">{erros.coordenadas}</p> : null}
            <label className="form-field">
              <span>Data da memória</span>
              <input name="dataCaptura" type="date" value={valores.dataCaptura} onChange={alterar} />
              <small className="metadata-status">{status(foto.origemData, "Não encontrada na foto")}</small>
            </label>

            {foto.avisos?.length ? (
              <div className="form-alert" role="status">
                <AlertCircle aria-hidden="true" />
                <div><strong>Alguns dados não puderam ser lidos</strong>{foto.avisos.map((aviso) => <p key={aviso}>{aviso}</p>)}</div>
              </div>
            ) : null}
            {mensagem ? <div className="form-alert" role="alert"><AlertCircle /><p>{mensagem}</p></div> : null}

            <div className="dialog-actions">
              <Button type="button" variant="outline" disabled={ocupado} onClick={fechar}>Concluir depois</Button>
              <Button type="submit" disabled={ocupado}>
                {estado === "salvando" ? <><LoaderCircle className="spin" /> Salvando…</> : "Salvar memória"}
              </Button>
            </div>
          </form>
        ) : null}
      </div>
    </dialog>
  );
}
