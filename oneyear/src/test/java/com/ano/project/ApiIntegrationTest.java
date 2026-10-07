package com.ano.project;

import com.ano.project.database.models.Foto;
import com.ano.project.database.models.Usuario;
import com.ano.project.database.repository.IFotoRepository;
import com.ano.project.database.repository.IUsuarioRepository;
import com.ano.project.service.ArmazenamentoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.MockMvc;

import javax.imageio.ImageIO;
import jakarta.servlet.http.Cookie;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
		"spring.datasource.url=jdbc:h2:mem:oneyear;MODE=PostgreSQL;DB_CLOSE_DELAY=-1",
		"spring.datasource.username=sa",
		"spring.datasource.password=",
		"spring.jpa.hibernate.ddl-auto=create-drop",
		"spring.flyway.enabled=false",
		"app.usuarios.provisionar=false",
		"app.armazenamento.tipo=teste",
		"server.servlet.session.cookie.secure=false",
		"app.historia.frase-principal=Uma história de teste",
		"app.historia.introducao=Introdução de teste",
		"app.historia.dicas[0]=Dica de teste",
		"app.historia.secoes[0].id=segunda",
		"app.historia.secoes[0].ordem=2",
		"app.historia.secoes[0].titulo=Segunda seção",
		"app.historia.secoes[0].texto=Texto dois",
		"app.historia.secoes[1].id=primeira",
		"app.historia.secoes[1].ordem=1",
		"app.historia.secoes[1].titulo=Primeira seção",
		"app.historia.secoes[1].texto=Texto um"
})
@AutoConfigureMockMvc
class ApiIntegrationTest {

	@Autowired MockMvc mvc;
	@Autowired IUsuarioRepository usuarios;
	@Autowired IFotoRepository fotos;
	@Autowired PasswordEncoder encoder;
	@MockitoBean ArmazenamentoService armazenamento;

	private String login;
	private String segundoLogin;
	private String senha;
	private String segundaSenha;

	@BeforeEach
	void preparar() {
		fotos.deleteAll();
		usuarios.deleteAll();
		login = "usuario-" + UUID.randomUUID();
		segundoLogin = "par-" + UUID.randomUUID();
		senha = UUID.randomUUID().toString();
		segundaSenha = UUID.randomUUID().toString();
		usuarios.save(new Usuario(login, encoder.encode(senha), "Pessoa Um", "avatares/um.png", "Descrição", List.of("Gentil")));
		usuarios.save(new Usuario(segundoLogin, encoder.encode(segundaSenha),
				"Pessoa Dois", null, null, List.of()));
	}

	@Test
	void protegeConteudoEEntregaCsrf() throws Exception {
		mvc.perform(get("/api/v1/historia"))
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.codigo").value("NAO_AUTENTICADO"));

		mvc.perform(get("/api/v1/auth/csrf"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.token").isNotEmpty())
				.andExpect(jsonPath("$.headerName").value("X-CSRF-TOKEN"));
		mvc.perform(post("/api/v1/auth/logout").with(csrf()))
				.andExpect(status().isNoContent());
	}

	@Test
	void autenticaConsultaPerfilHistoriaESai() throws Exception {
		when(armazenamento.buscar("avatares/um.png"))
				.thenReturn(new ArmazenamentoService.Arquivo(new byte[] {1, 2}, "image/png"));
		mvc.perform(post("/api/v1/auth/login").with(csrf())
				.contentType("application/json")
				.content("{\"login\":\"inexistente\",\"senha\":\"x\"}"))
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.codigo").value("CREDENCIAIS_INVALIDAS"))
				.andExpect(jsonPath("$.mensagem").value("Login ou senha inválidos."));
		mvc.perform(post("/api/v1/auth/login").with(csrf())
				.contentType("application/json")
				.content("{\"login\":\"" + login + "\",\"senha\":\"incorreta\"}"))
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.codigo").value("CREDENCIAIS_INVALIDAS"))
				.andExpect(jsonPath("$.mensagem").value("Login ou senha inválidos."));

		MvcResult resultadoLogin = mvc.perform(post("/api/v1/auth/login").with(csrf())
				.contentType("application/json")
				.content("{\"login\":\"" + login + "\",\"senha\":\"" + senha + "\"}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.nome").value("Pessoa Um"))
				.andReturn();
		MockHttpSession sessao = (MockHttpSession) resultadoLogin.getRequest().getSession(false);
		String idSessao = sessao.getId();

		mvc.perform(get("/api/v1/me").session(sessao))
				.andExpect(status().isOk())
				.andExpect(header().string("Cache-Control", org.hamcrest.Matchers.containsString("no-store")))
				.andExpect(jsonPath("$.caracteristicas[0]").value("Gentil"))
				.andExpect(jsonPath("$.avatarUrl").value("/api/v1/me/avatar"));
		mvc.perform(get("/api/v1/me/avatar").session(sessao))
				.andExpect(status().isOk()).andExpect(content().bytes(new byte[] {1, 2}));
		mvc.perform(get("/api/v1/me/avatar").with(user(segundoLogin)))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.codigo").value("AVATAR_NAO_ENCONTRADO"));
		mvc.perform(get("/api/v1/historia").session(sessao))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.frasePrincipal").value("Uma história de teste"))
				.andExpect(jsonPath("$.introducao").value("Introdução de teste"))
				.andExpect(jsonPath("$.secoes[0].id").value("primeira"))
				.andExpect(jsonPath("$.secoes[1].id").value("segunda"))
				.andExpect(jsonPath("$.dicas[0]").value("Dica de teste"));
		mvc.perform(post("/api/v1/auth/logout").session(sessao).with(csrf()))
				.andExpect(status().isNoContent());
		mvc.perform(get("/api/v1/me").cookie(new Cookie("JSESSIONID", idSessao)))
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.codigo").value("NAO_AUTENTICADO"));

		MockHttpSession segundaSessao = (MockHttpSession) mvc.perform(post("/api/v1/auth/login").with(csrf())
				.contentType("application/json")
				.content("{\"login\":\"" + segundoLogin + "\",\"senha\":\"" + segundaSenha + "\"}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.nome").value("Pessoa Dois"))
				.andExpect(jsonPath("$.avatarUrl").doesNotExist())
				.andReturn().getRequest().getSession(false);
		mvc.perform(get("/api/v1/me").session(segundaSessao))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.nome").value("Pessoa Dois"));
	}

	@Test
	void executaFluxoCompletoDeFoto() throws Exception {
		byte[] png = png();
		MockMultipartFile arquivo = new MockMultipartFile("file", "memoria.png", "text/plain", png);
		when(armazenamento.buscar(anyString())).thenReturn(new ArmazenamentoService.Arquivo(png, "image/png"));

		mvc.perform(multipart("/api/v1/fotos").file(arquivo).with(user(login)).with(csrf()))
				.andExpect(status().isCreated())
				.andExpect(header().exists("Location"))
				.andExpect(jsonPath("$.contentType").value("image/png"))
				.andExpect(jsonPath("$.largura").value(2));

		Foto foto = fotos.findAll().getFirst();
		UUID id = foto.getId();

		mvc.perform(get("/api/v1/fotos").with(user(login)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalElements").value(1));
		mvc.perform(get("/api/v1/fotos/anos").with(user(login)))
				.andExpect(status().isOk()).andExpect(content().json("[]"));
		mvc.perform(get("/api/v1/fotos/pins").with(user(login)))
				.andExpect(status().isOk()).andExpect(jsonPath("$.totalElements").value(0));
		mvc.perform(get("/api/v1/fotos/{id}", id).with(user(login)))
				.andExpect(status().isOk()).andExpect(jsonPath("$.id").value(id.toString()));
		mvc.perform(get("/api/v1/fotos/{id}/arquivo", id).with(user(login)))
				.andExpect(status().isOk()).andExpect(content().bytes(png));

		mvc.perform(patch("/api/v1/fotos/{id}", id).with(user(login)).with(csrf())
				.contentType("application/json")
				.content("{\"legenda\":\"Nossa memória\",\"latitude\":-21.23,\"longitude\":-44.99,\"dataCaptura\":\"2025-10-05\"}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.origemLocalizacao").value("MANUAL"))
				.andExpect(jsonPath("$.origemData").value("MANUAL"));
		mvc.perform(patch("/api/v1/fotos/{id}", id).with(user(login)).with(csrf())
				.contentType("application/json").content("{\"legenda\":null}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.legenda").doesNotExist())
				.andExpect(jsonPath("$.latitude").value(-21.23));

		mvc.perform(get("/api/v1/fotos/pins").with(user(login)))
				.andExpect(status().isOk()).andExpect(jsonPath("$.totalElements").value(1));
		mvc.perform(get("/api/v1/fotos/anos").with(user(login)))
				.andExpect(status().isOk()).andExpect(content().json("[2025]"));
	}

	@Test
	void rejeitaPaginacaoCoordenadasETipoInvalidos() throws Exception {
		mvc.perform(get("/api/v1/fotos?page=-1").with(user(login)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.codigo").value("PAGINACAO_INVALIDA"));

		MockMultipartFile arquivo = new MockMultipartFile("file", "texto.txt", "text/plain", new byte[] {1, 2, 3});
		mvc.perform(multipart("/api/v1/fotos").file(arquivo).with(user(login)).with(csrf()))
				.andExpect(status().isUnsupportedMediaType());

		Foto foto = novaFoto(usuarios.findByLogin(login).orElseThrow());
		foto = fotos.save(foto);
		mvc.perform(patch("/api/v1/fotos/{id}", foto.getId()).with(user(login)).with(csrf())
				.contentType("application/json").content("{\"latitude\":-21.0}"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.codigo").value("COORDENADAS_INVALIDAS"));
	}

	private byte[] png() throws Exception {
		BufferedImage imagem = new BufferedImage(2, 3, BufferedImage.TYPE_INT_RGB);
		ByteArrayOutputStream output = new ByteArrayOutputStream();
		ImageIO.write(imagem, "png", output);
		return output.toByteArray();
	}

	private Foto novaFoto(Usuario autor) {
		Foto foto = new Foto();
		foto.setAutor(autor);
		foto.setStorageKey("fotos/" + UUID.randomUUID() + ".png");
		foto.setContentType("image/png");
		foto.setTamanho(10);
		foto.setLargura(1);
		foto.setAltura(1);
		return foto;
	}
}
