package com.ano.project.service;

import com.ano.project.config.AplicacaoProperties;
import com.ano.project.exception.ApiException;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.exception.SdkException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.time.Instant;
import java.util.List;

@Service
@ConditionalOnProperty(name = "app.armazenamento.tipo", havingValue = "neon", matchIfMissing = true)
public class ArmazenamentoService {

	public record Arquivo(byte[] bytes, String contentType) { }
	public record Objeto(String chave, Instant modificadoEm) { }

	private final S3Client s3;
	private final String bucket;

	public ArmazenamentoService(S3Client s3, AplicacaoProperties properties) {
		this.s3 = s3;
		this.bucket = properties.getArmazenamento().getBucket();
	}

	public void salvar(String chave, byte[] bytes, String contentType) {
		try {
			PutObjectRequest request = PutObjectRequest.builder().bucket(bucket).key(chave).contentType(contentType).build();
			s3.putObject(request, RequestBody.fromBytes(bytes));
		} catch (SdkException erro) {
			throw indisponivel();
		}
	}

	public Arquivo buscar(String chave) {
		try {
			GetObjectRequest request = GetObjectRequest.builder().bucket(bucket).key(chave).build();
			ResponseBytes<GetObjectResponse> resposta = s3.getObjectAsBytes(request);
			return new Arquivo(resposta.asByteArray(), resposta.response().contentType());
		} catch (SdkException erro) {
			if (erro instanceof S3Exception s3Erro && s3Erro.statusCode() == 404) {
				throw new ApiException(HttpStatus.NOT_FOUND, "ARQUIVO_NAO_ENCONTRADO", "Arquivo não encontrado.");
			}
			throw indisponivel();
		}
	}

	public void remover(String chave) {
		try {
			s3.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key(chave).build());
		} catch (SdkException erro) {
			throw indisponivel();
		}
	}

	public List<Objeto> listarFotos() {
		try {
			ListObjectsV2Request request = ListObjectsV2Request.builder().bucket(bucket).prefix("fotos/").build();
			return s3.listObjectsV2Paginator(request)
					.stream()
					.flatMap(resposta -> resposta.contents().stream())
					.map(objeto -> new Objeto(objeto.key(), objeto.lastModified()))
					.toList();
		} catch (SdkException erro) {
			throw indisponivel();
		}
	}

	private ApiException indisponivel() {
		return new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "ARMAZENAMENTO_INDISPONIVEL",
				"O armazenamento está temporariamente indisponível.");
	}
}
