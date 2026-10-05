package com.ano.project.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.net.URI;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@ConfigurationProperties(prefix = "app")
public class AplicacaoProperties {

	private final Usuarios usuarios = new Usuarios();
	private final Armazenamento armazenamento = new Armazenamento();
	private final Historia historia = new Historia();
	private final Cors cors = new Cors();

	public Usuarios getUsuarios() { return usuarios; }
	public Armazenamento getArmazenamento() { return armazenamento; }
	public Historia getHistoria() { return historia; }
	public Cors getCors() { return cors; }

	public static class Usuarios {
		private boolean provisionar = true;
		private Conta primeira = new Conta();
		private Conta segunda = new Conta();
		public boolean isProvisionar() { return provisionar; }
		public void setProvisionar(boolean provisionar) { this.provisionar = provisionar; }
		public Conta getPrimeira() { return primeira; }
		public void setPrimeira(Conta primeira) { this.primeira = primeira; }
		public Conta getSegunda() { return segunda; }
		public void setSegunda(Conta segunda) { this.segunda = segunda; }
	}

	public static class Conta {
		private String login;
		private String senhaHash;
		private String nome;
		private String avatarKey;
		private String descricao;
		private List<String> caracteristicas = new ArrayList<>();
		public String getLogin() { return login; }
		public void setLogin(String login) { this.login = login; }
		public String getSenhaHash() { return senhaHash; }
		public void setSenhaHash(String senhaHash) { this.senhaHash = senhaHash; }
		public String getNome() { return nome; }
		public void setNome(String nome) { this.nome = nome; }
		public String getAvatarKey() { return avatarKey; }
		public void setAvatarKey(String avatarKey) { this.avatarKey = avatarKey; }
		public String getDescricao() { return descricao; }
		public void setDescricao(String descricao) { this.descricao = descricao; }
		public List<String> getCaracteristicas() { return caracteristicas; }
		public void setCaracteristicas(List<String> caracteristicas) { this.caracteristicas = caracteristicas; }
	}

	public static class Armazenamento {
		private String tipo = "neon";
		private URI endpoint;
		private String regiao = "us-east-2";
		private String bucket;
		private String accessKey;
		private String secretKey;
		private boolean pathStyle = true;
		public String getTipo() { return tipo; }
		public void setTipo(String tipo) { this.tipo = tipo; }
		public URI getEndpoint() { return endpoint; }
		public void setEndpoint(URI endpoint) { this.endpoint = endpoint; }
		public String getRegiao() { return regiao; }
		public void setRegiao(String regiao) { this.regiao = regiao; }
		public String getBucket() { return bucket; }
		public void setBucket(String bucket) { this.bucket = bucket; }
		public String getAccessKey() { return accessKey; }
		public void setAccessKey(String accessKey) { this.accessKey = accessKey; }
		public String getSecretKey() { return secretKey; }
		public void setSecretKey(String secretKey) { this.secretKey = secretKey; }
		public boolean isPathStyle() { return pathStyle; }
		public void setPathStyle(boolean pathStyle) { this.pathStyle = pathStyle; }
	}

	public static class Historia {
		private String frasePrincipal = "";
		private String introducao = "";
		private List<Secao> secoes = new ArrayList<>();
		private List<String> dicas = new ArrayList<>();
		public String getFrasePrincipal() { return frasePrincipal; }
		public void setFrasePrincipal(String frasePrincipal) { this.frasePrincipal = frasePrincipal; }
		public String getIntroducao() { return introducao; }
		public void setIntroducao(String introducao) { this.introducao = introducao; }
		public List<Secao> getSecoes() { return secoes; }
		public void setSecoes(List<Secao> secoes) { this.secoes = secoes; }
		public List<String> getDicas() { return dicas; }
		public void setDicas(List<String> dicas) { this.dicas = dicas; }
	}

	public static class Secao {
		private String id;
		private int ordem;
		private String titulo;
		private String texto;
		private LocalDate data;
		private UUID fotoId;
		public String getId() { return id; }
		public void setId(String id) { this.id = id; }
		public int getOrdem() { return ordem; }
		public void setOrdem(int ordem) { this.ordem = ordem; }
		public String getTitulo() { return titulo; }
		public void setTitulo(String titulo) { this.titulo = titulo; }
		public String getTexto() { return texto; }
		public void setTexto(String texto) { this.texto = texto; }
		public LocalDate getData() { return data; }
		public void setData(LocalDate data) { this.data = data; }
		public UUID getFotoId() { return fotoId; }
		public void setFotoId(UUID fotoId) { this.fotoId = fotoId; }
	}

	public static class Cors {
		private List<String> allowedOrigins = new ArrayList<>();
		public List<String> getAllowedOrigins() { return allowedOrigins; }
		public void setAllowedOrigins(List<String> allowedOrigins) { this.allowedOrigins = allowedOrigins; }
	}
}
