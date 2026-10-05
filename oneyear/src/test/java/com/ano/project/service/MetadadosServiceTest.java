package com.ano.project.service;

import org.junit.jupiter.api.Test;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;

class MetadadosServiceTest {

	private final MetadadosService service = new MetadadosService();

	@Test
	void aceitaImagemSemExifSemInventarDados() throws Exception {
		ByteArrayOutputStream output = new ByteArrayOutputStream();
		ImageIO.write(new BufferedImage(1, 1, BufferedImage.TYPE_INT_RGB), "png", output);
		MetadadosService.Metadados dados = service.extrair(output.toByteArray());
		assertNull(dados.latitude());
		assertNull(dados.data());
	}

	@Test
	void transformaFalhaDeLeituraEmAviso() {
		MetadadosService.Metadados dados = service.extrair(new byte[] {1, 2, 3});
		assertFalse(dados.avisos().isEmpty());
	}
}
