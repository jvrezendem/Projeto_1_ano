package com.ano.project.service;

import com.ano.project.controller.GostosRequest;
import com.ano.project.controller.ParceiroResponse;
import com.ano.project.controller.PerfilResponse;
import com.ano.project.database.models.Usuario;
import com.ano.project.database.repository.IUsuarioRepository;
import com.ano.project.exception.ApiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
public class PerfilService {

	private static final Logger log = LoggerFactory.getLogger(PerfilService.class);
	private final IUsuarioRepository repository;
	private final UsuarioService usuarioService;
	private final ImagemService imagemService;
	private final ArmazenamentoService armazenamento;
	private final TransactionTemplate transacao;

	public PerfilService(IUsuarioRepository repository, UsuarioService usuarioService,
			ImagemService imagemService, ArmazenamentoService armazenamento,
			PlatformTransactionManager transactionManager) {
		this.repository = repository;
		this.usuarioService = usuarioService;
		this.imagemService = imagemService;
		this.armazenamento = armazenamento;
		this.transacao = new TransactionTemplate(transactionManager);
	}

	public ParceiroResponse buscarParceiro(String login) {
		return respostaParceiro(encontrarParceiro(login));
	}

	public ParceiroResponse atualizarGostosDoParceiro(String login, GostosRequest request) {
		List<String> gostos = request.gostos().stream().map(String::trim).toList();
		Usuario atualizado = transacao.execute(status -> {
			Usuario parceiro = encontrarParceiro(login);
			parceiro.atualizarGostos(gostos);
			return repository.saveAndFlush(parceiro);
		});
		return respostaParceiro(atualizado);
	}

	public PerfilResponse atualizarAvatar(String login, MultipartFile arquivo) {
		ImagemService.ImagemValidada imagem = imagemService.validar(arquivo);
		Usuario usuario = usuarioService.buscarUsuario(login);
		String chaveAnterior = usuario.getAvatarKey();
		String novaChave = "avatares/" + usuario.getId() + "/" + UUID.randomUUID() + imagem.extensao();
		armazenamento.salvar(novaChave, imagem.bytes(), imagem.contentType());
		try {
			transacao.executeWithoutResult(status -> {
				Usuario atual = usuarioService.buscarUsuario(login);
				atual.atualizarAvatar(novaChave);
				repository.saveAndFlush(atual);
			});
		} catch (RuntimeException erro) {
			removerSemFalhar(novaChave, "novo avatar órfão");
			throw erro;
		}
		if (chaveAnterior != null && !chaveAnterior.equals(novaChave)) {
			removerSemFalhar(chaveAnterior, "avatar anterior");
		}
		return usuarioService.buscarPerfil(login);
	}

	private Usuario encontrarParceiro(String login) {
		List<Usuario> parceiros = repository.findParceiros(login);
		if (parceiros.size() != 1) {
			throw new ApiException(HttpStatus.CONFLICT, "PARCEIRO_INDISPONIVEL",
					"Não foi possível identificar o outro perfil.");
		}
		return parceiros.getFirst();
	}

	private ParceiroResponse respostaParceiro(Usuario usuario) {
		return new ParceiroResponse(usuario.getId(), usuario.getNome(), List.copyOf(usuario.getCaracteristicas()));
	}

	private void removerSemFalhar(String chave, String contexto) {
		try {
			armazenamento.remover(chave);
		} catch (RuntimeException erro) {
			log.error("Falha ao remover {}: chave={}", contexto, chave, erro);
		}
	}
}
