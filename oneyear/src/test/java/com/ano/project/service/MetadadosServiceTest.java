package com.ano.project.service;

import org.junit.jupiter.api.Test;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
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

	@Test
	void extraiGpsSulOesteEDataSemInventarFuso() throws Exception {
		MetadadosService.Metadados dados = service.extrair(jpegComExif());
		assertEquals("-21.2416667", dados.latitude().toPlainString());
		assertEquals("-44.9900000", dados.longitude().toPlainString());
		assertEquals(LocalDate.of(2025, 10, 5), dados.data());
		assertEquals(LocalTime.of(14, 30), dados.hora());
		assertNull(dados.offset());
	}

	@Test
	void sinalizaExifInvalidoEmImagemLegivel() throws Exception {
		byte[] jpeg = jpeg();
		byte[] exifInvalido = {0x45, 0x78, 0x69, 0x66, 0, 0, 0x49, 0x49, 0x2a, 0, 8, 0, 0, 0, 1};
		MetadadosService.Metadados dados = service.extrair(injetarExif(jpeg, exifInvalido));
		assertFalse(dados.avisos().isEmpty());
		assertNull(dados.latitude());
	}

	private byte[] jpegComExif() throws Exception {
		ByteBuffer tiff = ByteBuffer.allocate(178).order(ByteOrder.LITTLE_ENDIAN);
		tiff.put((byte) 'I').put((byte) 'I').putShort((short) 42).putInt(8);
		tiff.position(8).putShort((short) 2);
		entrada(tiff, 0x8769, 4, 1, 38);
		entrada(tiff, 0x8825, 4, 1, 76);
		tiff.putInt(0);
		tiff.position(38).putShort((short) 1);
		entrada(tiff, 0x9003, 2, 20, 56);
		tiff.putInt(0);
		tiff.position(56).put("2025:10:05 14:30:00\0".getBytes(StandardCharsets.US_ASCII));
		tiff.position(76).putShort((short) 4);
		entrada(tiff, 0x0001, 2, 2, 'S');
		entrada(tiff, 0x0002, 5, 3, 130);
		entrada(tiff, 0x0003, 2, 2, 'W');
		entrada(tiff, 0x0004, 5, 3, 154);
		tiff.putInt(0);
		tiff.position(130);
		racional(tiff, 21, 1); racional(tiff, 14, 1); racional(tiff, 30, 1);
		racional(tiff, 44, 1); racional(tiff, 59, 1); racional(tiff, 24, 1);
		byte[] exif = new byte[184];
		System.arraycopy("Exif\0\0".getBytes(StandardCharsets.US_ASCII), 0, exif, 0, 6);
		System.arraycopy(tiff.array(), 0, exif, 6, tiff.array().length);
		return injetarExif(jpeg(), exif);
	}

	private byte[] jpeg() throws Exception {
		ByteArrayOutputStream output = new ByteArrayOutputStream();
		ImageIO.write(new BufferedImage(2, 2, BufferedImage.TYPE_INT_RGB), "jpeg", output);
		return output.toByteArray();
	}

	private byte[] injetarExif(byte[] jpeg, byte[] exif) throws Exception {
		ByteArrayOutputStream output = new ByteArrayOutputStream();
		output.write(jpeg, 0, 2);
		output.write(0xff); output.write(0xe1);
		int tamanho = exif.length + 2;
		output.write(tamanho >> 8); output.write(tamanho & 0xff);
		output.write(exif);
		output.write(jpeg, 2, jpeg.length - 2);
		return output.toByteArray();
	}

	private void entrada(ByteBuffer buffer, int tag, int tipo, int quantidade, int valor) {
		buffer.putShort((short) tag).putShort((short) tipo).putInt(quantidade).putInt(valor);
	}

	private void racional(ByteBuffer buffer, int numerador, int denominador) {
		buffer.putInt(numerador).putInt(denominador);
	}
}
