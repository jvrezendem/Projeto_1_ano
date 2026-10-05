package com.ano.project.controller;

import com.ano.project.service.ArmazenamentoService;
import com.ano.project.service.FotoService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/fotos")
public class FotoController {

	private final FotoService service;

	public FotoController(FotoService service) {
		this.service = service;
	}

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<FotoResponse> cadastrar(@RequestPart("file") MultipartFile file,
			Authentication authentication, UriComponentsBuilder uriBuilder) {
		FotoResponse foto = service.cadastrar(file, authentication.getName());
		return ResponseEntity.created(uriBuilder.path("/api/v1/fotos/{id}").build(foto.id())).body(foto);
	}

	@GetMapping
	public PaginaFotoResponse listar(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "24") int size, @RequestParam(required = false) Integer ano) {
		return service.listar(page, size, ano);
	}

	@GetMapping("/anos")
	public List<Integer> anos() {
		return service.listarAnos();
	}

	@GetMapping("/pins")
	public PaginaPinResponse pins(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "100") int size) {
		return service.listarPins(page, size);
	}

	@GetMapping("/{id}")
	public FotoResponse buscar(@PathVariable UUID id) {
		return service.buscar(id);
	}

	@GetMapping("/{id}/arquivo")
	public ResponseEntity<byte[]> arquivo(@PathVariable UUID id) {
		ArmazenamentoService.Arquivo arquivo = service.buscarArquivo(id);
		MediaType tipo = arquivo.contentType() == null ? MediaType.APPLICATION_OCTET_STREAM
				: MediaType.parseMediaType(arquivo.contentType());
		return ResponseEntity.ok().contentType(tipo).body(arquivo.bytes());
	}

	@PatchMapping("/{id}")
	public FotoResponse atualizar(@PathVariable UUID id, @Valid @RequestBody FotoPatchRequest request) {
		return service.atualizar(id, request);
	}
}
