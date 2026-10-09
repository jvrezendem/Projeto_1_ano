package com.ano.project.config;

import com.ano.project.database.models.Usuario;
import com.ano.project.database.repository.IUsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UsuariosIniciaisConfig implements ApplicationRunner {

	private final IUsuarioRepository repository;
	private final AplicacaoProperties properties;

	public UsuariosIniciaisConfig(IUsuarioRepository repository, AplicacaoProperties properties) {
		this.repository = repository;
		this.properties = properties;
	}

	@Override
	@Transactional
	public void run(ApplicationArguments args) {
		if (!properties.getUsuarios().isProvisionar()) return;
		List<AplicacaoProperties.Conta> contas = List.of(
				properties.getUsuarios().getPrimeira(), properties.getUsuarios().getSegunda());
		contas.forEach(this::validar);
		if (contas.get(0).getLogin().equals(contas.get(1).getLogin())) {
			throw new IllegalStateException("As duas contas devem possuir logins diferentes.");
		}
		long ausentes = contas.stream().filter(c -> repository.findByLogin(c.getLogin()).isEmpty()).count();
		if (repository.count() + ausentes != 2) {
			throw new IllegalStateException("O banco deve conter exatamente as duas contas configuradas.");
		}
		contas.forEach(conta -> repository.findByLogin(conta.getLogin()).ifPresentOrElse(
				usuario -> usuario.atualizarNome(conta.getNome().trim()),
				() -> repository.save(novoUsuario(conta))));
		repository.flush();
		if (repository.count() != 2) {
			throw new IllegalStateException("O banco deve conter exatamente duas contas.");
		}
	}

	private void validar(AplicacaoProperties.Conta conta) {
		if (vazio(conta.getLogin()) || vazio(conta.getSenhaHash()) || vazio(conta.getNome())) {
			throw new IllegalStateException("Configure login, hash de senha e nome para as duas contas.");
		}
	}

	private Usuario novoUsuario(AplicacaoProperties.Conta conta) {
		List<String> caracteristicas = conta.getCaracteristicas() == null ? List.of() : conta.getCaracteristicas().stream()
				.filter(valor -> valor != null && !valor.isBlank()).map(String::trim).toList();
		return new Usuario(conta.getLogin().trim(), conta.getSenhaHash(), conta.getNome().trim(),
				normalizar(conta.getAvatarKey()), normalizar(conta.getDescricao()), caracteristicas);
	}

	private boolean vazio(String valor) {
		return valor == null || valor.isBlank();
	}

	private String normalizar(String valor) {
		return vazio(valor) ? null : valor.trim();
	}
}
