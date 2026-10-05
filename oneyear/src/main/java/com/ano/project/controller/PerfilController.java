package com.ano.project.controller;

import com.ano.project.database.models.Usuario;
import com.ano.project.exception.ApiException;
import com.ano.project.service.ArmazenamentoService;
import com.ano.project.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/me")
public class PerfilController {

	private final UsuarioService usuarioService;
	private final ArmazenamentoService armazenamento;

	public PerfilController(UsuarioService usuarioService, ArmazenamentoService armazenamento) {
		this.usuarioService = usuarioService;
		this.armazenamento = armazenamento;
	}

	@GetMapping
	public PerfilResponse perfil(Authentication authentication) {
		return usuarioService.buscarPerfil(authentication.getName());
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
