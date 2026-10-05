package com.ano.project.controller;

import com.ano.project.exception.ApiException;
import com.ano.project.service.TentativasLoginService;
import com.ano.project.service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Locale;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

	private final AuthenticationManager authenticationManager;
	private final UsuarioService usuarioService;
	private final TentativasLoginService tentativas;
	private final HttpSessionSecurityContextRepository contextRepository = new HttpSessionSecurityContextRepository();

	public AuthController(AuthenticationManager authenticationManager, UsuarioService usuarioService,
			TentativasLoginService tentativas) {
		this.authenticationManager = authenticationManager;
		this.usuarioService = usuarioService;
		this.tentativas = tentativas;
	}

	@GetMapping("/csrf")
	public CsrfResponse csrf(CsrfToken token) {
		return new CsrfResponse(token.getToken(), token.getHeaderName());
	}

	@PostMapping("/login")
	public PerfilResponse login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest,
			HttpServletResponse response) {
		String chave = httpRequest.getRemoteAddr() + ":" + request.login().toLowerCase(Locale.ROOT);
		tentativas.verificar(chave);
		try {
			Authentication autenticacao = authenticationManager.authenticate(
					UsernamePasswordAuthenticationToken.unauthenticated(request.login(), request.senha()));
			if (httpRequest.getSession(false) != null) httpRequest.changeSessionId();
			SecurityContext context = SecurityContextHolder.createEmptyContext();
			context.setAuthentication(autenticacao);
			SecurityContextHolder.setContext(context);
			contextRepository.saveContext(context, httpRequest, response);
			tentativas.registrarSucesso(chave);
			return usuarioService.buscarPerfil(autenticacao.getName());
		} catch (AuthenticationException erro) {
			tentativas.registrarFalha(chave);
			throw new ApiException(HttpStatus.UNAUTHORIZED, "CREDENCIAIS_INVALIDAS", "Login ou senha inválidos.");
		}
	}

	@PostMapping("/logout")
	public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) {
		new SecurityContextLogoutHandler().logout(request, response, authentication);
		return ResponseEntity.noContent().build();
	}
}
