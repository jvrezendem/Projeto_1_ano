package com.ano.project.controller;

import java.util.List;
import java.util.UUID;

public record PerfilResponse(
		UUID id,
		String nome,
		String avatarUrl,
		String descricao,
		List<String> gostos) {
}
