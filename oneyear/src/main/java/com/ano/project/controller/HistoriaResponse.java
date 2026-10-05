package com.ano.project.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record HistoriaResponse(
		String frasePrincipal,
		String introducao,
		List<SecaoHistoriaResponse> secoes,
		List<String> dicas) {

	public record SecaoHistoriaResponse(
			String id,
			int ordem,
			String titulo,
			String texto,
			LocalDate data,
			UUID fotoId) {
	}
}
