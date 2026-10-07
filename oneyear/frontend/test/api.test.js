import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import {
  atualizarFoto,
  cadastrarFoto,
  entrar,
  listarAnos,
  listarFotos,
  listarTodosPins,
  obterFoto,
  obterHistoria,
  obterPerfil,
  sair,
  urlDaApi,
} from "../src/api.js";

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
});

function response(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

test("entrar obtém CSRF, envia credenciais com cookie e renova o token", async () => {
  const chamadas = [];
  const respostas = [
    response(200, { token: "antes", headerName: "X-CSRF-TOKEN" }),
    response(200, { id: "1", nome: "Perfil", caracteristicas: [] }),
    response(200, { token: "depois", headerName: "X-CSRF-TOKEN" }),
  ];
  global.fetch = async (url, opcoes) => {
    chamadas.push({ url, opcoes });
    return respostas.shift();
  };

  const perfil = await entrar("conta", "segredo");

  assert.equal(perfil.nome, "Perfil");
  assert.equal(chamadas.length, 3);
  assert.equal(chamadas[1].opcoes.credentials, "include");
  assert.equal(chamadas[1].opcoes.headers["X-CSRF-TOKEN"], "antes");
  assert.deepEqual(JSON.parse(chamadas[1].opcoes.body), { login: "conta", senha: "segredo" });
});

test("obterPerfil desativa cache e sair envia CSRF", async () => {
  const chamadas = [];
  const respostas = [
    response(200, { nome: "Perfil" }),
    response(204, null),
  ];
  global.fetch = async (url, opcoes) => {
    chamadas.push({ url, opcoes });
    return respostas.shift();
  };

  await obterPerfil();
  await sair();

  assert.equal(chamadas[0].opcoes.cache, "no-store");
  assert.equal(chamadas[1].opcoes.method, "POST");
  assert.equal(chamadas[1].opcoes.headers["X-CSRF-TOKEN"], "depois");
  assert.equal(urlDaApi("/api/v1/me/avatar"), "/api/v1/me/avatar");
});

test("obterHistoria consulta o conteúdo privado sem usar cache", async () => {
  const chamadas = [];
  global.fetch = async (url, opcoes) => {
    chamadas.push({ url, opcoes });
    return response(200, { frasePrincipal: "Teste", introducao: "", secoes: [], dicas: [] });
  };

  const historia = await obterHistoria();

  assert.equal(historia.frasePrincipal, "Teste");
  assert.equal(chamadas[0].url, "/api/v1/historia");
  assert.equal(chamadas[0].opcoes.cache, "no-store");
  assert.equal(chamadas[0].opcoes.credentials, "include");
});

test("lista, envia o arquivo original e atualiza os metadados da foto", async () => {
  const chamadas = [];
  const respostas = [
    response(200, { items: [], totalElements: 0 }),
    response(200, { token: "fotos", headerName: "X-CSRF-TOKEN" }),
    response(201, { id: "foto-1", avisos: [] }),
    response(200, { id: "foto-1", legenda: "Memória" }),
  ];
  global.fetch = async (url, opcoes) => {
    chamadas.push({ url, opcoes });
    return respostas.shift();
  };

  await listarFotos();
  const arquivo = new File([new Uint8Array([1, 2, 3])], "foto.png", { type: "image/png" });
  await cadastrarFoto(arquivo);
  await atualizarFoto("foto-1", { legenda: "Memória", latitude: null, longitude: null });

  assert.equal(chamadas[0].url, "/api/v1/fotos?page=0&size=24");
  assert.equal(chamadas[2].opcoes.method, "POST");
  assert.ok(chamadas[2].opcoes.body instanceof FormData);
  assert.equal(chamadas[2].opcoes.body.get("file").name, "foto.png");
  assert.equal(chamadas[2].opcoes.headers["Content-Type"], undefined);
  assert.equal(chamadas[2].opcoes.headers["X-CSRF-TOKEN"], "fotos");
  assert.equal(chamadas[3].opcoes.method, "PATCH");
  assert.deepEqual(JSON.parse(chamadas[3].opcoes.body), { legenda: "Memória", latitude: null, longitude: null });
});

test("aplica o filtro de ano no backend e consulta anos e detalhe", async () => {
  const chamadas = [];
  const respostas = [
    response(200, { items: [], page: 0, hasNext: false }),
    response(200, [2022, 2024]),
    response(200, { id: "foto-1" }),
  ];
  global.fetch = async (url, opcoes) => {
    chamadas.push({ url, opcoes });
    return respostas.shift();
  };

  await listarFotos({ ano: 2024 });
  assert.deepEqual(await listarAnos(), [2022, 2024]);
  assert.equal((await obterFoto("foto-1")).id, "foto-1");

  assert.equal(chamadas[0].url, "/api/v1/fotos?page=0&size=24&ano=2024");
  assert.equal(chamadas[1].url, "/api/v1/fotos/anos");
  assert.equal(chamadas[2].url, "/api/v1/fotos/foto-1");
});

test("carrega todas as páginas de pins sem omitir coleções maiores que cem", async () => {
  const chamadas = [];
  const primeiraPagina = Array.from({ length: 100 }, (_, indice) => ({ fotoId: `foto-${indice}` }));
  global.fetch = async (url, opcoes) => {
    chamadas.push({ url, opcoes });
    return url.includes("page=0")
      ? response(200, { items: primeiraPagina, page: 0, hasNext: true })
      : response(200, { items: [{ fotoId: "foto-100" }], page: 1, hasNext: false });
  };

  const pins = await listarTodosPins();

  assert.equal(pins.length, 101);
  assert.equal(pins.at(-1).fotoId, "foto-100");
  assert.equal(chamadas[0].url, "/api/v1/fotos/pins?page=0&size=100");
  assert.equal(chamadas[1].url, "/api/v1/fotos/pins?page=1&size=100");
});
