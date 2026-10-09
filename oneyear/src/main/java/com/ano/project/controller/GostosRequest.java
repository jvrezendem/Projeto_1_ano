package com.ano.project.controller;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record GostosRequest(
		@NotNull
		@Size(max = 8, message = "Informe no máximo 8 itens.")
		List<@NotBlank(message = "Os itens não podem estar vazios.")
				@Size(max = 80, message = "Cada item pode ter no máximo 80 caracteres.") String> gostos) {
}
