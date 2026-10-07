package com.ano.project.config;

import com.ano.project.database.models.Usuario;
import com.ano.project.database.repository.IUsuarioRepository;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class UsuariosIniciaisConfigTest {

	@Test
	void criaExatamenteAsDuasContasSemSobrescreverExistentes() {
		IUsuarioRepository repository = mock(IUsuarioRepository.class);
		AplicacaoProperties properties = propriedadesValidas();
		when(repository.count()).thenReturn(0L, 2L);
		when(repository.findByLogin(anyString())).thenReturn(Optional.empty());
		new UsuariosIniciaisConfig(repository, properties).run(null);
		verify(repository, times(2)).save(any(Usuario.class));

		repository = mock(IUsuarioRepository.class);
		when(repository.count()).thenReturn(2L);
		when(repository.findByLogin(anyString())).thenReturn(Optional.of(mock(Usuario.class)));
		new UsuariosIniciaisConfig(repository, properties).run(null);
		verify(repository, never()).save(any());
	}

	@Test
	void recusaConfiguracaoIncompleta() {
		AplicacaoProperties incompleta = new AplicacaoProperties();
		assertThrows(IllegalStateException.class,
				() -> new UsuariosIniciaisConfig(mock(IUsuarioRepository.class), incompleta).run(null));

		AplicacaoProperties duplicada = propriedadesValidas();
		duplicada.getUsuarios().getSegunda().setLogin("um");
		assertThrows(IllegalStateException.class,
				() -> new UsuariosIniciaisConfig(mock(IUsuarioRepository.class), duplicada).run(null));
	}

	private AplicacaoProperties propriedadesValidas() {
		AplicacaoProperties properties = new AplicacaoProperties();
		configurar(properties.getUsuarios().getPrimeira(), "um");
		configurar(properties.getUsuarios().getSegunda(), "dois");
		return properties;
	}

	private void configurar(AplicacaoProperties.Conta conta, String login) {
		conta.setLogin(login);
		conta.setSenhaHash("hash-externo");
		conta.setNome("Nome");
		conta.setCaracteristicas(List.of());
	}
}
