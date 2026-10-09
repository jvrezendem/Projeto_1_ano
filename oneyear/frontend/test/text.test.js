import assert from "node:assert/strict";
import { test } from "node:test";
import { textoUnicode } from "../src/text.js";

test("corrige texto UTF-8 interpretado como Latin-1", () => {
  assert.equal(textoUnicode("JoÃ£o Vitor"), "João Vitor");
  assert.equal(textoUnicode("VocÃª Ã© incrÃ­vel"), "Você é incrível");
});

test("preserva Unicode válido e nomes com Ã legítimo", () => {
  assert.equal(textoUnicode("João Vitor"), "João Vitor");
  assert.equal(textoUnicode("Ãngela"), "Ãngela");
  assert.equal(textoUnicode(null), "");
});
