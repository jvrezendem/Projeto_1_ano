package com.ano.project.controller;

import com.ano.project.service.HistoriaService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/historia")
public class HistoriaController {

	private final HistoriaService service;

	public HistoriaController(HistoriaService service) {
		this.service = service;
	}

	@GetMapping
	public HistoriaResponse buscar() {
		return service.buscar();
	}
}
