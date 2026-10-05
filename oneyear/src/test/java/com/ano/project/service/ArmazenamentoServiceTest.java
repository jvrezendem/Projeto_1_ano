package com.ano.project.service;

import com.ano.project.config.AplicacaoProperties;
import com.ano.project.exception.ApiException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.paginators.ListObjectsV2Iterable;

import java.time.Instant;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ArmazenamentoServiceTest {

	private S3Client s3;
	private ArmazenamentoService service;

	@BeforeEach
	void preparar() {
		s3 = mock(S3Client.class);
		AplicacaoProperties properties = new AplicacaoProperties();
		properties.getArmazenamento().setBucket("privado");
		service = new ArmazenamentoService(s3, properties);
	}

	@Test
	void salvaBuscaRemoveELista() {
		byte[] bytes = {1, 2, 3};
		when(s3.getObjectAsBytes(any(GetObjectRequest.class))).thenReturn(ResponseBytes.fromByteArray(
				GetObjectResponse.builder().contentType("image/png").build(), bytes));
		ListObjectsV2Iterable paginas = mock(ListObjectsV2Iterable.class);
		when(s3.listObjectsV2Paginator(any(ListObjectsV2Request.class))).thenReturn(paginas);
		when(paginas.stream()).thenReturn(Stream.of(ListObjectsV2Response.builder()
				.contents(objeto -> objeto.key("fotos/a.png").lastModified(Instant.EPOCH)).build()));

		service.salvar("fotos/a.png", bytes, "image/png");
		ArmazenamentoService.Arquivo arquivo = service.buscar("fotos/a.png");
		service.remover("fotos/a.png");

		assertArrayEquals(bytes, arquivo.bytes());
		assertEquals("image/png", arquivo.contentType());
		assertEquals(1, service.listarFotos().size());
		verify(s3).putObject(any(PutObjectRequest.class), any(software.amazon.awssdk.core.sync.RequestBody.class));
		verify(s3).deleteObject(any(DeleteObjectRequest.class));
	}

	@Test
	void traduzAusenciaEFalhaDoStorage() {
		when(s3.getObjectAsBytes(any(GetObjectRequest.class)))
				.thenThrow(S3Exception.builder().statusCode(404).build());
		assertEquals(404, assertThrows(ApiException.class, () -> service.buscar("x")).getStatus().value());

		when(s3.getObjectAsBytes(any(GetObjectRequest.class)))
				.thenThrow(S3Exception.builder().statusCode(500).build());
		assertEquals(503, assertThrows(ApiException.class, () -> service.buscar("x")).getStatus().value());
	}
}
