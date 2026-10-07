import assert from "node:assert/strict";
import { test } from "node:test";
import {
  agruparFotosPorAno,
  agruparPinsCoincidentes,
  formatarCoordenadas,
  formatarData,
  nomeDoLugar,
} from "../src/memory.js";

test("formata data e usa os fallbacks definidos pela spec", () => {
  assert.match(formatarData("2024-01-15"), /15 de janeiro de 2024/);
  assert.equal(formatarData(null), "Data não informada");
  assert.equal(formatarCoordenadas(-21.245678, -44.998765), "Lat. -21.24568, Long. -44.99876");
  assert.equal(nomeDoLugar({ lugar: "", latitude: -21.2, longitude: -44.9 }), "Lat. -21.20000, Long. -44.90000");
});

test("mantém grupos cronológicos e coloca fotos sem data ao final", () => {
  const grupos = agruparFotosPorAno([
    { id: "1", dataCaptura: "2022-01-01" },
    { id: "2", dataCaptura: "2023-03-10" },
    { id: "3", dataCaptura: null },
  ]);

  assert.deepEqual(grupos.map((grupo) => grupo.ano), ["2022", "2023", "sem-data"]);
  assert.equal(grupos.at(-1).items[0].id, "3");
});

test("agrupa coordenadas coincidentes sem descartar nenhuma memória", () => {
  const grupos = agruparPinsCoincidentes([
    { fotoId: "1", latitude: -21.2, longitude: -44.9 },
    { fotoId: "2", latitude: -21.2, longitude: -44.9 },
    { fotoId: "3", latitude: -22, longitude: -45 },
  ]);

  assert.equal(grupos.length, 2);
  assert.deepEqual(grupos[0].pins.map((pin) => pin.fotoId), ["1", "2"]);
});
