export const TEMA_CLARO = "claro";
export const TEMA_ESCURO = "escuro";

const CHAVE_TEMA = "ana.tema";
const CHAVE_MOVIMENTO = "ana.movimentoPausado";

function armazenamentoPadrao() {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

function consultaPadrao(valor) {
  try {
    return globalThis.matchMedia?.(valor).matches ?? false;
  } catch {
    return false;
  }
}

export function lerPreferencias(armazenamento = armazenamentoPadrao(), consultar = consultaPadrao) {
  let temaSalvo;
  let movimentoSalvo = false;
  try {
    temaSalvo = armazenamento?.getItem(CHAVE_TEMA);
    movimentoSalvo = armazenamento?.getItem(CHAVE_MOVIMENTO) === "true";
  } catch {
    temaSalvo = undefined;
  }

  const temaSistema = consultar("(prefers-color-scheme: dark)") ? TEMA_ESCURO : TEMA_CLARO;
  const movimentoSistema = consultar("(prefers-reduced-motion: reduce)");
  const tema = temaSalvo === TEMA_CLARO || temaSalvo === TEMA_ESCURO ? temaSalvo : temaSistema;
  return { tema, movimentoPausado: movimentoSalvo || movimentoSistema, movimentoSistema };
}

export function salvarPreferencia(chave, valor, armazenamento = armazenamentoPadrao()) {
  const nome = chave === "tema" ? CHAVE_TEMA : CHAVE_MOVIMENTO;
  try {
    armazenamento?.setItem(nome, String(valor));
    return true;
  } catch {
    return false;
  }
}

export function aplicarPreferencias({ tema, movimentoPausado }) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = tema;
  document.documentElement.dataset.motion = movimentoPausado ? "paused" : "running";
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    "content",
    tema === TEMA_ESCURO ? "#071426" : "#ffffff",
  );
}
