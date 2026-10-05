package com.ano.project.service;

import com.ano.project.database.repository.IFotoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@ConditionalOnProperty(name = "app.armazenamento.tipo", havingValue = "neon", matchIfMissing = true)
public class ReconciliacaoService {

	private static final Logger log = LoggerFactory.getLogger(ReconciliacaoService.class);
	private final ArmazenamentoService armazenamento;
	private final IFotoRepository repository;

	public ReconciliacaoService(ArmazenamentoService armazenamento, IFotoRepository repository) {
		this.armazenamento = armazenamento;
		this.repository = repository;
	}

	@Scheduled(fixedDelayString = "PT24H", initialDelayString = "PT10M")
	public void removerOrfaos() {
		Instant limite = Instant.now().minus(24, ChronoUnit.HOURS);
		armazenamento.listarFotos().stream()
				.filter(objeto -> objeto.modificadoEm().isBefore(limite))
				.filter(objeto -> !repository.existsByStorageKey(objeto.chave()))
				.forEach(objeto -> remover(objeto.chave()));
	}

	private void remover(String chave) {
		try {
			armazenamento.remover(chave);
			log.info("Arquivo órfão removido: chave={}", chave);
		} catch (RuntimeException erro) {
			log.error("Falha ao remover arquivo órfão: chave={}", chave);
		}
	}
}
