package com.ano.project.service;

import com.ano.project.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TentativasLoginService {

	private static final int LIMITE = 5;
	private static final Duration JANELA = Duration.ofMinutes(15);
	private final Map<String, ArrayDeque<Instant>> falhas = new ConcurrentHashMap<>();
	private final Clock clock;

	public TentativasLoginService() {
		this(Clock.systemUTC());
	}

	TentativasLoginService(Clock clock) {
		this.clock = clock;
	}

	public synchronized void verificar(String chave) {
		ArrayDeque<Instant> tentativas = limpar(chave);
		if (tentativas.size() >= LIMITE) {
			throw new ApiException(HttpStatus.TOO_MANY_REQUESTS, "MUITAS_TENTATIVAS",
					"Aguarde antes de tentar entrar novamente.");
		}
	}

	public synchronized void registrarFalha(String chave) {
		limpar(chave).addLast(clock.instant());
	}

	public synchronized void registrarSucesso(String chave) {
		falhas.remove(chave);
	}

	private ArrayDeque<Instant> limpar(String chave) {
		ArrayDeque<Instant> tentativas = falhas.computeIfAbsent(chave, ignorado -> new ArrayDeque<>());
		Instant limite = clock.instant().minus(JANELA);
		while (!tentativas.isEmpty() && tentativas.peekFirst().isBefore(limite)) tentativas.removeFirst();
		return tentativas;
	}
}
