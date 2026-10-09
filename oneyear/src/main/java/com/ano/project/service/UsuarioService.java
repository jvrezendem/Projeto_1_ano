package com.ano.project.service;

import com.ano.project.controller.PerfilResponse;
import com.ano.project.database.models.Usuario;
import com.ano.project.database.repository.IUsuarioRepository;
import com.ano.project.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService implements UserDetailsService {

	private final IUsuarioRepository repository;

	public UsuarioService(IUsuarioRepository repository) {
		this.repository = repository;
	}

	@Override
	public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
		Usuario usuario = repository.findByLogin(login)
				.orElseThrow(() -> new UsernameNotFoundException("Credenciais inválidas."));
		return User.withUsername(usuario.getLogin()).password(usuario.getSenhaHash()).roles("USUARIO").build();
	}

	public Usuario buscarUsuario(String login) {
		return repository.findByLogin(login)
				.orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "SESSAO_INVALIDA", "Sessão inválida."));
	}

	public PerfilResponse buscarPerfil(String login) {
		Usuario usuario = buscarUsuario(login);
		String avatarUrl = usuario.getAvatarKey() == null ? null
				: "/api/v1/me/avatar?v=" + Integer.toUnsignedString(usuario.getAvatarKey().hashCode());
		return new PerfilResponse(usuario.getId(), usuario.getNome(), avatarUrl, usuario.getDescricao(),
				List.copyOf(usuario.getCaracteristicas()));
	}
}
