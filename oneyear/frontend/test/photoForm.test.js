import assert from "node:assert/strict";
import { test } from "node:test";
import { prepararMetadados, TAMANHO_MAXIMO_FOTO, validarArquivoFoto, valoresDaFoto } from "../src/photoForm.js";

test("aceita JPEG e PNG até o limite inclusive", () => {
  assert.equal(validarArquivoFoto({ type: "image/jpeg", size: TAMANHO_MAXIMO_FOTO }), "");
  assert.equal(validarArquivoFoto({ type: "image/png", size: TAMANHO_MAXIMO_FOTO }), "");
  assert.equal(validarArquivoFoto({ name: "foto.JPG", type: "", size: 10 }), "");
  assert.match(validarArquivoFoto({ type: "image/webp", size: 10 }), /JPEG ou PNG/);
  assert.match(validarArquivoFoto({ type: "image/png", size: TAMANHO_MAXIMO_FOTO + 1 }), /15 MiB/);
});

test("exige o par de coordenadas e aceita os limites", () => {
  const incompleto = prepararMetadados({ legenda: "", lugar: "", latitude: "-21", longitude: "", dataCaptura: "" });
  assert.equal(incompleto.erros.coordenadas, "Informe latitude e longitude juntas.");

  const limites = prepararMetadados({ legenda: "  memória  ", lugar: "  ", latitude: "-90", longitude: "180", dataCaptura: "2025-10-05" });
  assert.deepEqual(limites.erros, {});
  assert.deepEqual(limites.dados, {
    legenda: "memória",
    lugar: null,
    latitude: -90,
    longitude: 180,
    dataCaptura: "2025-10-05",
  });
});

test("preenche a revisão sem inventar metadados ausentes", () => {
  assert.deepEqual(valoresDaFoto({ legenda: null, lugar: null, latitude: null, longitude: null, dataCaptura: null }), {
    legenda: "", lugar: "", latitude: "", longitude: "", dataCaptura: "",
  });
});
