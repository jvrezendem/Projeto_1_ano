package com.ano.project.controller;

import java.util.List;

public record PaginaFotoResponse(
		List<FotoResponse> items,
		int page,
		int size,
		long totalElements,
		int totalPages,
		boolean hasNext) {
}
