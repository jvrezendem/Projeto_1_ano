package com.ano.project.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record PinResponse(
		UUID fotoId,
		BigDecimal latitude,
		BigDecimal longitude,
		String lugar,
		LocalDate dataCaptura) {
}
