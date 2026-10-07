package com.ano.project.service;

import com.ano.project.database.models.Foto;
import com.ano.project.database.models.Usuario;
import com.ano.project.database.repository.IFotoRepository;
import com.ano.project.exception.ApiException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.SimpleTransactionStatus;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class FotoServiceTest {

	private IFotoRepository repository;
	private UsuarioService usuarios;
	private MetadadosService metadados;
	private ArmazenamentoService armazenamento;
	private FotoService service;

	@BeforeEach
	void preparar() {
		repository = mock(IFotoRepository.class);
		usuarios = mock(UsuarioService.class);
		metadados = mock(MetadadosService.class);
		armazenamento = mock(ArmazenamentoService.class);
		PlatformTransactionManager transacoes = mock(PlatformTransactionManager.class);
		when(transacoes.getTransaction(any())).thenReturn(new SimpleTransactionStatus());
		when(usuarios.buscarUsuario(anyString())).thenReturn(mock(Usuario.class));
		when(metadados.extrair(any())).thenReturn(new MetadadosService.Metadados(
				null, null, null, null, null, List.of()));
		service = new FotoService(repository, usuarios, metadados, armazenamento, transacoes);
	}

	@Test
	void removeArquivoQuandoBancoFalha() throws Exception {
		when(repository.saveAndFlush(any(Foto.class))).thenThrow(new DataIntegrityViolationException("falha"));
		assertThrows(DataIntegrityViolationException.class, () -> service.cadastrar(arquivoValido(), "usuario"));
		verify(armazenamento).remover(anyString());
	}

	@Test
	void naoGravaBancoQuandoStorageFalha() throws Exception {
		doThrow(new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "FALHA", "Falha"))
				.when(armazenamento).salvar(anyString(), any(), anyString());
		assertThrows(ApiException.class, () -> service.cadastrar(arquivoValido(), "usuario"));
		verify(repository, never()).saveAndFlush(any());
	}

	@Test
	void rejeitaArquivoAcimaDoLimiteAntesDoStorage() {
		byte[] bytes = new byte[15 * 1024 * 1024 + 1];
		MockMultipartFile arquivo = new MockMultipartFile("file", "foto.png", "image/png", bytes);
		ApiException erro = assertThrows(ApiException.class, () -> service.cadastrar(arquivo, "usuario"));
		org.junit.jupiter.api.Assertions.assertEquals("ARQUIVO_MUITO_GRANDE", erro.getCodigo());
		verify(armazenamento, never()).salvar(anyString(), any(), anyString());
	}

	@Test
	void rejeitaImagemComMaisDeQuarentaMilhoesDePixels() throws Exception {
		byte[] bytes = arquivoValido().getBytes();
		bytes[16] = 0; bytes[17] = 0; bytes[18] = 39; bytes[19] = 16;
		bytes[20] = 0; bytes[21] = 0; bytes[22] = 15; bytes[23] = (byte) 161;
		MockMultipartFile arquivo = new MockMultipartFile("file", "foto.png", "image/png", bytes);
		ApiException erro = assertThrows(ApiException.class, () -> service.cadastrar(arquivo, "usuario"));
		org.junit.jupiter.api.Assertions.assertEquals("IMAGEM_MUITO_GRANDE", erro.getCodigo());
		verify(armazenamento, never()).salvar(anyString(), any(), anyString());
	}

	private MockMultipartFile arquivoValido() throws Exception {
		ByteArrayOutputStream output = new ByteArrayOutputStream();
		ImageIO.write(new BufferedImage(1, 1, BufferedImage.TYPE_INT_RGB), "png", output);
		return new MockMultipartFile("file", "foto.png", "image/png", output.toByteArray());
	}
}
