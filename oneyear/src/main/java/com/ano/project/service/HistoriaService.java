package com.ano.project.service;

import com.ano.project.config.AplicacaoProperties;
import com.ano.project.controller.HistoriaResponse;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class HistoriaService {

	private final AplicacaoProperties properties;

	public HistoriaService(AplicacaoProperties properties) {
		this.properties = properties;
	}

	public HistoriaResponse buscar() {
		AplicacaoProperties.Historia historia = properties.getHistoria();
		var secoes = historia.getSecoes().stream()
				.sorted(Comparator.comparingInt(AplicacaoProperties.Secao::getOrdem))
				.map(secao -> new HistoriaResponse.SecaoHistoriaResponse(secao.getId(), secao.getOrdem(),
						secao.getTitulo(), secao.getTexto(), secao.getData(), secao.getFotoId()))
				.toList();
		return new HistoriaResponse(historia.getFrasePrincipal(), historia.getIntroducao(), secoes,
				List.copyOf(historia.getDicas()));
	}
}
