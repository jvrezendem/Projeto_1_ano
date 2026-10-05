package com.ano.project.controller;

import java.util.List;

public record PaginaPinResponse(
		List<PinResponse> items,
		int page,
		int size,
		long totalElements,
		int totalPages,
		boolean hasNext) {
}
