package com.ano.project.controller;

import com.ano.project.database.models.Foto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;

public record FotoResponse(
		UUID id,
		String arquivoUrl,
		String contentType,
		int largura,
		int altura,
		String legenda,
		String lugar,
		BigDecimal latitude,
		BigDecimal longitude,
		LocalDate dataCaptura,
		LocalTime horaCaptura,
		ZoneOffset offsetCaptura,
		Foto.Origem origemLocalizacao,
		Foto.Origem origemData,
		Instant criadoEm,
		Instant atualizadoEm,
		List<String> avisos) {
}
