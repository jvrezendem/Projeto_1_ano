package com.ano.project.service;

import com.ano.project.exception.ApiException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class TentativasLoginServiceTest {

	@Test
	void bloqueiaAposCincoFalhasELiberaAposSucesso() {
		TentativasLoginService service = new TentativasLoginService();
		for (int i = 0; i < 5; i++) service.registrarFalha("chave");
		ApiException erro = assertThrows(ApiException.class, () -> service.verificar("chave"));
		assertEquals(429, erro.getStatus().value());
		service.registrarSucesso("chave");
		assertDoesNotThrow(() -> service.verificar("chave"));
	}
}
