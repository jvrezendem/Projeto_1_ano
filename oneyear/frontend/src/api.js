const ambiente = typeof import.meta.env === "object" ? import.meta.env : {};
const baseUrl = (ambiente.VITE_API_URL || "").replace(/\/$/, "");
let csrfAtual;

export class ApiError extends Error {
  constructor(status, dados) {
    super(dados?.mensagem || "Não foi possível concluir a operação.");
    this.name = "ApiError";
    this.status = status;
    this.codigo = dados?.codigo;
    this.campos = dados?.campos || {};
  }
}

async function respostaJson(response) {
  if (response.status === 204) return null;
  return response.json().catch(() => null);
}

async function requisitar(caminho, opcoes = {}) {
  const response = await fetch(`${baseUrl}${caminho}`, {
    cache: "no-store",
    credentials: "include",
    ...opcoes,
    headers: {
      Accept: "application/json",
      ...opcoes.headers,
    },
  });
  const dados = await respostaJson(response);
  if (!response.ok) throw new ApiError(response.status, dados);
  return dados;
}

async function obterCsrf() {
  if (!csrfAtual) csrfAtual = await requisitar("/api/v1/auth/csrf");
  return csrfAtual;
}

async function escrever(caminho, opcoes = {}) {
  const csrf = await obterCsrf();
  return requisitar(caminho, {
    ...opcoes,
    headers: {
      ...opcoes.headers,
      [csrf.headerName]: csrf.token,
    },
  });
}

export async function entrar(login, senha) {
  const perfil = await escrever("/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login, senha }),
  });
  csrfAtual = undefined;
  await obterCsrf();
  return perfil;
}

export function obterPerfil() {
  return requisitar("/api/v1/me");
}

export function obterHistoria() {
  return requisitar("/api/v1/historia");
}

export function listarFotos({ page = 0, size = 24, ano } = {}) {
  const parametros = new URLSearchParams({ page, size });
  if (ano) parametros.set("ano", ano);
  return requisitar(`/api/v1/fotos?${parametros}`);
}

export function listarAnos() {
  return requisitar("/api/v1/fotos/anos");
}

export function listarPins({ page = 0, size = 100 } = {}) {
  return requisitar(`/api/v1/fotos/pins?page=${page}&size=${size}`);
}

export async function listarTodosPins() {
  const pins = [];
  let page = 0;
  let pagina;
  do {
    pagina = await listarPins({ page });
    pins.push(...(pagina.items || []));
    page += 1;
  } while (pagina.hasNext);
  return pins;
}

export function obterFoto(id) {
  return requisitar(`/api/v1/fotos/${id}`);
}

export function cadastrarFoto(arquivo) {
  const formulario = new FormData();
  formulario.append("file", arquivo);
  return escrever("/api/v1/fotos", { method: "POST", body: formulario });
}

export function atualizarFoto(id, dados) {
  return escrever(`/api/v1/fotos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
}

export async function sair() {
  try {
    await escrever("/api/v1/auth/logout", { method: "POST" });
  } finally {
    csrfAtual = undefined;
  }
}

export function urlDaApi(caminho) {
  return caminho ? `${baseUrl}${caminho}` : "";
}
