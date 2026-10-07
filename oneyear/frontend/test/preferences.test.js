import assert from "node:assert/strict";
import { test } from "node:test";
import { lerPreferencias, salvarPreferencia, TEMA_CLARO, TEMA_ESCURO } from "../src/preferences.js";

function armazenamento(valores = {}) {
  return {
    getItem: (chave) => valores[chave] ?? null,
    setItem: (chave, valor) => { valores[chave] = valor; },
  };
}

test("restaura tema e pausa salvos", () => {
  const preferencias = lerPreferencias(armazenamento({
    "ana.tema": TEMA_ESCURO,
    "ana.movimentoPausado": "true",
  }), () => false);

  assert.equal(preferencias.tema, TEMA_ESCURO);
  assert.equal(preferencias.movimentoPausado, true);
});

test("usa preferências do sistema quando não há armazenamento", () => {
  const preferencias = lerPreferencias(armazenamento(), (consulta) => consulta.includes("dark") || consulta.includes("reduced"));

  assert.equal(preferencias.tema, TEMA_ESCURO);
  assert.equal(preferencias.movimentoPausado, true);
  assert.equal(preferencias.movimentoSistema, true);
});

test("continua funcionando quando armazenamento local está indisponível", () => {
  const indisponivel = {
    getItem: () => { throw new Error("indisponível"); },
    setItem: () => { throw new Error("indisponível"); },
  };

  assert.equal(lerPreferencias(indisponivel, () => false).tema, TEMA_CLARO);
  assert.equal(salvarPreferencia("tema", TEMA_ESCURO, indisponivel), false);
});
