package com.ano.project.database.models;

import jakarta.persistence.Column;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "usuarios")
public class Usuario {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@Column(nullable = false, unique = true, length = 80)
	private String login;

	@Column(name = "senha_hash", nullable = false, length = 100)
	private String senhaHash;

	@Column(nullable = false, length = 120)
	private String nome;

	@Column(name = "avatar_key", unique = true, length = 255)
	private String avatarKey;

	@Column(length = 1000)
	private String descricao;

	@ElementCollection(fetch = FetchType.EAGER)
	@CollectionTable(name = "usuario_caracteristicas", joinColumns = @JoinColumn(name = "usuario_id"))
	@Column(name = "caracteristicas")
	private List<String> caracteristicas = new ArrayList<>();

	public Usuario(String login, String senhaHash, String nome, String avatarKey,
			String descricao, List<String> caracteristicas) {
		this.login = login;
		this.senhaHash = senhaHash;
		this.nome = nome;
		this.avatarKey = avatarKey;
		this.descricao = descricao;
		this.caracteristicas = caracteristicas == null ? new ArrayList<>() : new ArrayList<>(caracteristicas);
	}

	public void atualizarAvatar(String avatarKey) {
		this.avatarKey = avatarKey;
	}

	public void atualizarNome(String nome) {
		this.nome = nome;
	}

	public void atualizarGostos(List<String> gostos) {
		this.caracteristicas.clear();
		this.caracteristicas.addAll(gostos);
	}
}
