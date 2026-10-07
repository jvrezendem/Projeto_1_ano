export const TAMANHO_MAXIMO_FOTO = 15 * 1024 * 1024;

const TIPOS_ACEITOS = new Set(["image/jpeg", "image/png"]);

export function validarArquivoFoto(arquivo) {
  if (!arquivo) return "Escolha uma imagem.";
  const extensaoAceita = /\.(jpe?g|png)$/i.test(arquivo.name || "");
  if (!TIPOS_ACEITOS.has(arquivo.type) && !extensaoAceita) return "Escolha uma imagem JPEG ou PNG.";
  if (arquivo.size > TAMANHO_MAXIMO_FOTO) return "A imagem deve ter no máximo 15 MiB.";
  return "";
}

function textoOuNulo(valor) {
  const texto = valor.trim();
  return texto || null;
}

function numeroOuNulo(valor) {
  return valor.trim() ? Number(valor) : null;
}

export function prepararMetadados(valores) {
  const legenda = textoOuNulo(valores.legenda);
  const lugar = textoOuNulo(valores.lugar);
  const latitude = numeroOuNulo(valores.latitude);
  const longitude = numeroOuNulo(valores.longitude);
  const erros = {};

  if (legenda?.length > 500) erros.legenda = "Use no máximo 500 caracteres.";
  if (lugar?.length > 120) erros.lugar = "Use no máximo 120 caracteres.";
  if ((latitude === null) !== (longitude === null)) erros.coordenadas = "Informe latitude e longitude juntas.";
  if (latitude !== null && (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)) {
    erros.latitude = "Informe um valor entre -90 e 90.";
  }
  if (longitude !== null && (!Number.isFinite(longitude) || longitude < -180 || longitude > 180)) {
    erros.longitude = "Informe um valor entre -180 e 180.";
  }

  return {
    erros,
    dados: {
      legenda,
      lugar,
      latitude,
      longitude,
      dataCaptura: valores.dataCaptura || null,
    },
  };
}

export function valoresDaFoto(foto) {
  return {
    legenda: foto.legenda || "",
    lugar: foto.lugar || "",
    latitude: foto.latitude?.toString() || "",
    longitude: foto.longitude?.toString() || "",
    dataCaptura: foto.dataCaptura || "",
  };
}
