package com.ano.project.service;

import com.ano.project.controller.FotoPatchRequest;
import com.ano.project.controller.FotoResponse;
import com.ano.project.controller.PaginaFotoResponse;
import com.ano.project.controller.PaginaPinResponse;
import com.ano.project.controller.PinResponse;
import com.ano.project.database.models.Foto;
import com.ano.project.database.models.Usuario;
import com.ano.project.database.repository.IFotoRepository;
import com.ano.project.exception.ApiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
public class FotoService {

	private static final Logger log = LoggerFactory.getLogger(FotoService.class);
	private final IFotoRepository repository;
	private final UsuarioService usuarioService;
	private final MetadadosService metadadosService;
	private final ImagemService imagemService;
	private final ArmazenamentoService armazenamentoService;
	private final TransactionTemplate transacao;

	public FotoService(IFotoRepository repository, UsuarioService usuarioService,
			MetadadosService metadadosService, ImagemService imagemService,
			ArmazenamentoService armazenamentoService,
			PlatformTransactionManager transactionManager) {
		this.repository = repository;
		this.usuarioService = usuarioService;
		this.metadadosService = metadadosService;
		this.imagemService = imagemService;
		this.armazenamentoService = armazenamentoService;
		this.transacao = new TransactionTemplate(transactionManager);
	}

	public FotoResponse cadastrar(MultipartFile arquivo, String login) {
		ImagemService.ImagemValidada imagem = imagemService.validar(arquivo);
		MetadadosService.Metadados metadados = metadadosService.extrair(imagem.bytes());
		String chave = "fotos/" + UUID.randomUUID() + imagem.extensao();
		armazenamentoService.salvar(chave, imagem.bytes(), imagem.contentType());
		try {
			Foto foto = montarFoto(usuarioService.buscarUsuario(login), chave, imagem, metadados);
			Foto salva = transacao.execute(status -> repository.saveAndFlush(foto));
			return resposta(salva, metadados.avisos());
		} catch (RuntimeException erro) {
			compensar(chave);
			throw erro;
		}
	}

	public PaginaFotoResponse listar(int page, int size, Integer ano) {
		validarPaginacao(page, size);
		if (ano != null && (ano < 1000 || ano > 9999)) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "ANO_INVALIDO", "Informe um ano com quatro dígitos.");
		}
		Page<Foto> resultado = repository.buscarGaleria(ano, PageRequest.of(page, size));
		return new PaginaFotoResponse(resultado.stream().map(f -> resposta(f, List.of())).toList(), page, size,
				resultado.getTotalElements(), resultado.getTotalPages(), resultado.hasNext());
	}

	public List<Integer> listarAnos() {
		return repository.buscarAnos();
	}

	public PaginaPinResponse listarPins(int page, int size) {
		validarPaginacao(page, size);
		Page<Foto> resultado = repository.buscarPins(PageRequest.of(page, size));
		return new PaginaPinResponse(resultado.stream().map(this::pin).toList(), page, size,
				resultado.getTotalElements(), resultado.getTotalPages(), resultado.hasNext());
	}

	public FotoResponse buscar(UUID id) {
		return resposta(buscarEntidade(id), List.of());
	}

	public ArmazenamentoService.Arquivo buscarArquivo(UUID id) {
		return armazenamentoService.buscar(buscarEntidade(id).getStorageKey());
	}

	@Transactional
	public FotoResponse atualizar(UUID id, FotoPatchRequest request) {
		validarCoordenadas(request);
		Foto foto = buscarEntidade(id);
		if (request.isLegendaInformada()) foto.setLegenda(normalizar(request.getLegenda()));
		if (request.isLugarInformado()) foto.setLugar(normalizar(request.getLugar()));
		if (request.isLatitudeInformada()) {
			foto.setLatitude(request.getLatitude());
			foto.setLongitude(request.getLongitude());
			foto.setOrigemLocalizacao(request.getLatitude() == null ? Foto.Origem.AUSENTE : Foto.Origem.MANUAL);
		}
		if (request.isDataCapturaInformada()) {
			foto.setDataCaptura(request.getDataCaptura());
			foto.setHoraCaptura(null);
			foto.setOffsetCaptura(null);
			foto.setOrigemData(request.getDataCaptura() == null ? Foto.Origem.AUSENTE : Foto.Origem.MANUAL);
		}
		return resposta(repository.saveAndFlush(foto), List.of());
	}

	private Foto montarFoto(Usuario autor, String chave, ImagemService.ImagemValidada imagem,
			MetadadosService.Metadados metadados) {
		Foto foto = new Foto();
		foto.setAutor(autor);
		foto.setStorageKey(chave);
		foto.setContentType(imagem.contentType());
		foto.setTamanho(imagem.bytes().length);
		foto.setLargura(imagem.largura());
		foto.setAltura(imagem.altura());
		foto.setLatitude(metadados.latitude());
		foto.setLongitude(metadados.longitude());
		foto.setDataCaptura(metadados.data());
		foto.setHoraCaptura(metadados.hora());
		foto.setOffsetCaptura(metadados.offset());
		foto.setOrigemLocalizacao(metadados.origemLocalizacao());
		foto.setOrigemData(metadados.origemData());
		return foto;
	}

	private void compensar(String chave) {
		try {
			armazenamentoService.remover(chave);
		} catch (RuntimeException erro) {
			log.error("Falha ao compensar arquivo órfão: chave={}", chave);
		}
	}

	private Foto buscarEntidade(UUID id) {
		return repository.findById(id).orElseThrow(() ->
				new ApiException(HttpStatus.NOT_FOUND, "FOTO_NAO_ENCONTRADA", "Foto não encontrada."));
	}

	private FotoResponse resposta(Foto foto, List<String> avisos) {
		return new FotoResponse(foto.getId(), "/api/v1/fotos/" + foto.getId() + "/arquivo",
				foto.getContentType(), foto.getLargura(), foto.getAltura(), foto.getLegenda(), foto.getLugar(),
				foto.getLatitude(), foto.getLongitude(), foto.getDataCaptura(), foto.getHoraCaptura(),
				foto.getOffsetCaptura(), foto.getOrigemLocalizacao(), foto.getOrigemData(), foto.getCriadoEm(),
				foto.getAtualizadoEm(), avisos);
	}

	private PinResponse pin(Foto foto) {
		return new PinResponse(foto.getId(), foto.getLatitude(), foto.getLongitude(), foto.getLugar(), foto.getDataCaptura());
	}

	private void validarPaginacao(int page, int size) {
		if (page < 0 || size < 1 || size > 100) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "PAGINACAO_INVALIDA",
					"Page deve ser zero ou maior e size deve estar entre 1 e 100.");
		}
	}

	private void validarCoordenadas(FotoPatchRequest request) {
		if (request.isLatitudeInformada() != request.isLongitudeInformada()
				|| request.isLatitudeInformada() && (request.getLatitude() == null) != (request.getLongitude() == null)) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "COORDENADAS_INVALIDAS",
					"Informe latitude e longitude juntas.");
		}
	}

	private String normalizar(String valor) {
		return valor == null || valor.isBlank() ? null : valor.trim();
	}
}
