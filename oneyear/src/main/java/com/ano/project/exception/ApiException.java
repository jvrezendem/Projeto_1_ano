package com.ano.project.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.util.Map;

@Getter
public class ApiException extends RuntimeException {

	private final HttpStatus status;
	private final String codigo;
	private final Map<String, String> campos;

	public ApiException(HttpStatus status, String codigo, String mensagem) {
		this(status, codigo, mensagem, Map.of());
	}

	public ApiException(HttpStatus status, String codigo, String mensagem, Map<String, String> campos) {
		super(mensagem);
		this.status = status;
		this.codigo = codigo;
		this.campos = campos;
	}
}
