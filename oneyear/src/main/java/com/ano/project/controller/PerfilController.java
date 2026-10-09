package com.ano.project.controller;

import com.ano.project.database.models.Usuario;
import com.ano.project.exception.ApiException;
import com.ano.project.service.ArmazenamentoService;
import com.ano.project.service.PerfilService;
import com.ano.project.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/me")
public class PerfilController {

	private final UsuarioService usuarioService;
	private final PerfilService perfilService;
	private final ArmazenamentoService armazenamento;

	public PerfilController(UsuarioService usuarioService, PerfilService perfilService,
			ArmazenamentoService armazenamento) {
		this.usuarioService = usuarioService;
		this.perfilService = perfilService;
		this.armazenamento = armazenamento;
	}

	@GetMapping
	public PerfilResponse perfil(Authentication authentication) {
		return usuarioService.buscarPerfil(authentication.getName());
	}

	@PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public PerfilResponse atualizarAvatar(@RequestPart("file") MultipartFile arquivo,
			Authentication authentication) {
		return perfilService.atualizarAvatar(authentication.getName(), arquivo);
	}

	@GetMapping("/parceiro")
	public ParceiroResponse parceiro(Authentication authentication) {
		return perfilService.buscarParceiro(authentication.getName());
	}

	@PatchMapping("/parceiro/gostos")
	public ParceiroResponse atualizarGostos(@Valid @RequestBody GostosRequest request,
			Authentication authentication) {
		return perfilService.atualizarGostosDoParceiro(authentication.getName(), request);
	}

	@GetMapping("/avatar")
	public ResponseEntity<byte[]> avatar(Authentication authentication) {
		Usuario usuario = usuarioService.buscarUsuario(authentication.getName());
		if (usuario.getAvatarKey() == null) {
			throw new ApiException(HttpStatus.NOT_FOUND, "AVATAR_NAO_ENCONTRADO", "Avatar não encontrado.");
		}
		ArmazenamentoService.Arquivo arquivo = armazenamento.buscar(usuario.getAvatarKey());
		MediaType tipo = arquivo.contentType() == null ? MediaType.APPLICATION_OCTET_STREAM
				: MediaType.parseMediaType(arquivo.contentType());
		return ResponseEntity.ok().contentType(tipo).body(arquivo.bytes());
	}
}
