package com.ano.project.handler;

import com.ano.project.controller.ErroResponse;
import com.ano.project.exception.ApiException;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.dao.DataAccessException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@RestControllerAdvice
public class GlobalExceptionHandler {

	private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	@ExceptionHandler(ApiException.class)
	ResponseEntity<ErroResponse> tratarApi(ApiException erro, HttpServletRequest request) {
		return resposta(erro.getStatus(), erro.getCodigo(), erro.getMessage(), erro.getCampos(), request, null);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	ResponseEntity<ErroResponse> tratarValidacao(MethodArgumentNotValidException erro, HttpServletRequest request) {
		Map<String, String> campos = new LinkedHashMap<>();
		for (FieldError campo : erro.getBindingResult().getFieldErrors()) {
			campos.putIfAbsent(campo.getField(), campo.getDefaultMessage());
		}
		return resposta(HttpStatus.BAD_REQUEST, "DADOS_INVALIDOS", "Revise os campos informados.", campos, request, null);
	}

	@ExceptionHandler({HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class})
	ResponseEntity<ErroResponse> tratarEntradaInvalida(Exception erro, HttpServletRequest request) {
		return resposta(HttpStatus.BAD_REQUEST, "REQUISICAO_INVALIDA", "A requisição contém dados inválidos.", Map.of(), request, erro);
	}

	@ExceptionHandler(MaxUploadSizeExceededException.class)
	ResponseEntity<ErroResponse> tratarTamanho(MaxUploadSizeExceededException erro, HttpServletRequest request) {
		return resposta(HttpStatus.CONTENT_TOO_LARGE, "ARQUIVO_MUITO_GRANDE", "O arquivo excede 15 MiB.", Map.of(), request, erro);
	}

	@ExceptionHandler(HttpMediaTypeNotSupportedException.class)
	ResponseEntity<ErroResponse> tratarTipo(HttpMediaTypeNotSupportedException erro, HttpServletRequest request) {
		return resposta(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "TIPO_NAO_SUPORTADO", "Tipo de conteúdo não suportado.", Map.of(), request, erro);
	}

	@ExceptionHandler(DataAccessException.class)
	ResponseEntity<ErroResponse> tratarBanco(DataAccessException erro, HttpServletRequest request) {
		return resposta(HttpStatus.SERVICE_UNAVAILABLE, "BANCO_INDISPONIVEL",
				"O banco de dados está temporariamente indisponível.", Map.of(), request, erro);
	}

	@ExceptionHandler(Exception.class)
	ResponseEntity<ErroResponse> tratarInesperado(Exception erro, HttpServletRequest request) {
		return resposta(HttpStatus.INTERNAL_SERVER_ERROR, "ERRO_INTERNO", "Não foi possível concluir a operação.", Map.of(), request, erro);
	}

	private ResponseEntity<ErroResponse> resposta(HttpStatus status, String codigo, String mensagem,
			Map<String, String> campos, HttpServletRequest request, Exception causa) {
		String traceId = UUID.randomUUID().toString();
		if (causa == null) {
			log.info("traceId={} operacao={} status={} codigo={}", traceId, request.getRequestURI(), status.value(), codigo);
		} else {
			log.error("traceId={} operacao={} status={} codigo={}", traceId, request.getRequestURI(), status.value(), codigo, causa);
		}
		return ResponseEntity.status(status).body(new ErroResponse(codigo, mensagem, campos, traceId));
	}
}
