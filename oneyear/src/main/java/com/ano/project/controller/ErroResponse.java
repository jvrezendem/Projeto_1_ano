package com.ano.project.controller;

import java.util.Map;

public record ErroResponse(
		String codigo,
		String mensagem,
		Map<String, String> campos,
		String traceId) {
}
