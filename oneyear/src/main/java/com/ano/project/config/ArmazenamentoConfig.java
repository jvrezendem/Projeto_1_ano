package com.ano.project.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.http.urlconnection.UrlConnectionHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;

@Configuration
@ConditionalOnProperty(name = "app.armazenamento.tipo", havingValue = "neon", matchIfMissing = true)
public class ArmazenamentoConfig {

	@Bean
	S3Client s3Client(AplicacaoProperties properties) {
		AplicacaoProperties.Armazenamento config = properties.getArmazenamento();
		if (config.getEndpoint() == null || vazio(config.getBucket()) || vazio(config.getAccessKey()) || vazio(config.getSecretKey())) {
			throw new IllegalStateException("Configure endpoint, bucket e credenciais do Neon Object Storage.");
		}
		return S3Client.builder()
				.endpointOverride(config.getEndpoint())
				.region(Region.of(config.getRegiao()))
				.credentialsProvider(StaticCredentialsProvider.create(
						AwsBasicCredentials.create(config.getAccessKey(), config.getSecretKey())))
				.serviceConfiguration(S3Configuration.builder().pathStyleAccessEnabled(config.isPathStyle()).build())
				.httpClientBuilder(UrlConnectionHttpClient.builder())
				.build();
	}

	private boolean vazio(String valor) {
		return valor == null || valor.isBlank();
	}
}
