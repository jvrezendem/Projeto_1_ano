package com.ano.project.service;

import com.ano.project.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Iterator;

@Service
public class ImagemService {

	private static final long TAMANHO_MAXIMO = 15L * 1024 * 1024;
	private static final long PIXELS_MAXIMOS = 40_000_000L;

	public record ImagemValidada(byte[] bytes, String contentType, int largura, int altura) {
		public String extensao() {
			return contentType.equals("image/jpeg") ? ".jpg" : ".png";
		}
	}

	public ImagemValidada validar(MultipartFile arquivo) {
		byte[] bytes = ler(arquivo);
		String contentType = identificarTipo(bytes);
		BufferedImage imagem = decodificar(bytes);
		return new ImagemValidada(bytes, contentType, imagem.getWidth(), imagem.getHeight());
	}

	private byte[] ler(MultipartFile arquivo) {
		if (arquivo == null || arquivo.isEmpty()) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "ARQUIVO_OBRIGATORIO", "Informe uma imagem.");
		}
		if (arquivo.getSize() > TAMANHO_MAXIMO) {
			throw new ApiException(HttpStatus.CONTENT_TOO_LARGE, "ARQUIVO_MUITO_GRANDE", "O arquivo excede 15 MiB.");
		}
		try {
			return arquivo.getBytes();
		} catch (IOException erro) {
			throw new ApiException(HttpStatus.UNPROCESSABLE_CONTENT, "IMAGEM_INVALIDA", "Não foi possível ler a imagem.");
		}
	}

	private String identificarTipo(byte[] bytes) {
		if (bytes.length >= 3 && (bytes[0] & 0xff) == 0xff && (bytes[1] & 0xff) == 0xd8 && (bytes[2] & 0xff) == 0xff) {
			return "image/jpeg";
		}
		byte[] png = {(byte) 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a};
		if (bytes.length >= png.length) {
			boolean igual = true;
			for (int i = 0; i < png.length; i++) igual &= bytes[i] == png[i];
			if (igual) return "image/png";
		}
		throw new ApiException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "TIPO_NAO_SUPORTADO", "Envie uma imagem JPEG ou PNG.");
	}

	private BufferedImage decodificar(byte[] bytes) {
		try (ImageInputStream input = ImageIO.createImageInputStream(new ByteArrayInputStream(bytes))) {
			Iterator<ImageReader> leitores = ImageIO.getImageReaders(input);
			if (!leitores.hasNext()) throw new IOException("Formato não reconhecido.");
			ImageReader leitor = leitores.next();
			try {
				leitor.setInput(input, true, true);
				validarDimensoes(leitor.getWidth(0), leitor.getHeight(0));
				BufferedImage imagem = leitor.read(0);
				if (imagem != null) return imagem;
			} finally {
				leitor.dispose();
			}
		} catch (IOException ignorado) {
		}
		throw new ApiException(HttpStatus.UNPROCESSABLE_CONTENT, "IMAGEM_INVALIDA", "A imagem está corrompida.");
	}

	private void validarDimensoes(int largura, int altura) {
		long pixels = (long) largura * altura;
		if (pixels > PIXELS_MAXIMOS) {
			throw new ApiException(HttpStatus.UNPROCESSABLE_CONTENT, "IMAGEM_MUITO_GRANDE",
					"A imagem excede 40 milhões de pixels.");
		}
	}
}
