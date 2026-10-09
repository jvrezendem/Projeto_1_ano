const PADRAO_MOJIBAKE = /(?:Ã[\u0080-\u00bf]|Â[\u0080-\u00bf])/;

function decodificarLatin1ComoUtf8(texto) {
  try {
    const bytes = Uint8Array.from(texto, (caractere) => caractere.charCodeAt(0));
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return texto;
  }
}

export function textoUnicode(valor) {
  if (typeof valor !== "string") return "";
  let texto = valor;
  for (let tentativa = 0; tentativa < 2 && PADRAO_MOJIBAKE.test(texto); tentativa += 1) {
    const corrigido = decodificarLatin1ComoUtf8(texto);
    if (corrigido === texto) break;
    texto = corrigido;
  }
  return texto.normalize("NFC");
}
