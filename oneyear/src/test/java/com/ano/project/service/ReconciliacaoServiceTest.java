package com.ano.project.service;

import com.ano.project.database.repository.IFotoRepository;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ReconciliacaoServiceTest {

	@Test
	void removeSomenteOrfaoComMaisDeVinteEQuatroHoras() {
		ArmazenamentoService armazenamento = mock(ArmazenamentoService.class);
		IFotoRepository repository = mock(IFotoRepository.class);
		when(armazenamento.listarFotos()).thenReturn(List.of(
				new ArmazenamentoService.Objeto("fotos/orfao", Instant.now().minus(25, ChronoUnit.HOURS)),
				new ArmazenamentoService.Objeto("fotos/recente", Instant.now())));
		when(repository.existsByStorageKey("fotos/orfao")).thenReturn(false);

		new ReconciliacaoService(armazenamento, repository).removerOrfaos();

		verify(armazenamento).remover("fotos/orfao");
		verify(armazenamento, never()).remover("fotos/recente");
	}
}
