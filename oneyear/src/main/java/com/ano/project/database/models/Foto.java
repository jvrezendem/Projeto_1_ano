package com.ano.project.database.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "fotos")
public class Foto {

	public enum Origem { EXIF, MANUAL, AUSENTE }

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "autor_id", nullable = false)
	private Usuario autor;

	@Column(name = "storage_key", nullable = false, unique = true, length = 255)
	private String storageKey;

	@Column(name = "content_type", nullable = false, length = 30)
	private String contentType;

	@Column(nullable = false)
	private long tamanho;

	@Column(nullable = false)
	private int largura;

	@Column(nullable = false)
	private int altura;

	@Column(length = 500)
	private String legenda;

	@Column(length = 120)
	private String lugar;

	@Column(precision = 10, scale = 7)
	private BigDecimal latitude;

	@Column(precision = 10, scale = 7)
	private BigDecimal longitude;

	@Column(name = "data_captura")
	private LocalDate dataCaptura;

	@Column(name = "hora_captura")
	private LocalTime horaCaptura;

	@Column(name = "offset_captura")
	private ZoneOffset offsetCaptura;

	@Enumerated(EnumType.STRING)
	@Column(name = "origem_localizacao", nullable = false, length = 10)
	private Origem origemLocalizacao = Origem.AUSENTE;

	@Enumerated(EnumType.STRING)
	@Column(name = "origem_data", nullable = false, length = 10)
	private Origem origemData = Origem.AUSENTE;

	@Column(name = "criado_em", nullable = false, updatable = false)
	private Instant criadoEm;

	@Column(name = "atualizado_em", nullable = false)
	private Instant atualizadoEm;

	@PrePersist
	void criarDatas() {
		criadoEm = atualizadoEm = Instant.now();
	}

	@PreUpdate
	void atualizarData() {
		atualizadoEm = Instant.now();
	}
}
