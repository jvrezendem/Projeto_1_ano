export function formatarData(data) {
  if (!data) return "Data não informada";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${data}T00:00:00Z`));
}

export function formatarCoordenadas(latitude, longitude) {
  const lat = Number(latitude);
  const lon = Number(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return "Local não informado";
  return `Lat. ${lat.toFixed(5)}, Long. ${lon.toFixed(5)}`;
}

export function nomeDoLugar(memoria) {
  return memoria.lugar?.trim() || formatarCoordenadas(memoria.latitude, memoria.longitude);
}

export function agruparFotosPorAno(fotos) {
  const grupos = new Map();
  for (const foto of fotos) {
    const chave = foto.dataCaptura ? foto.dataCaptura.slice(0, 4) : "sem-data";
    if (!grupos.has(chave)) grupos.set(chave, []);
    grupos.get(chave).push(foto);
  }
  return Array.from(grupos, ([ano, items]) => ({ ano, items }));
}

export function agruparPinsCoincidentes(pins) {
  const grupos = new Map();
  for (const pin of pins) {
    const chave = `${pin.latitude},${pin.longitude}`;
    if (!grupos.has(chave)) {
      grupos.set(chave, { latitude: Number(pin.latitude), longitude: Number(pin.longitude), pins: [] });
    }
    grupos.get(chave).pins.push(pin);
  }
  return Array.from(grupos.values());
}
