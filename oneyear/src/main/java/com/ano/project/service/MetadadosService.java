package com.ano.project.service;

import com.ano.project.database.models.Foto;
import com.drew.imaging.ImageMetadataReader;
import com.drew.lang.GeoLocation;
import com.drew.metadata.Directory;
import com.drew.metadata.Metadata;
import com.drew.metadata.exif.ExifDirectoryBase;
import com.drew.metadata.exif.ExifSubIFDDirectory;
import com.drew.metadata.exif.GpsDirectory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.DateTimeException;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Service
public class MetadadosService {

	private static final DateTimeFormatter DATA_EXIF = DateTimeFormatter.ofPattern("uuuu:MM:dd HH:mm:ss");

	public record Metadados(BigDecimal latitude, BigDecimal longitude, LocalDate data,
			LocalTime hora, ZoneOffset offset, List<String> avisos) {
		public Foto.Origem origemLocalizacao() {
			return latitude == null ? Foto.Origem.AUSENTE : Foto.Origem.EXIF;
		}

		public Foto.Origem origemData() {
			return data == null ? Foto.Origem.AUSENTE : Foto.Origem.EXIF;
		}
	}

	public Metadados extrair(byte[] bytes) {
		List<String> avisos = new ArrayList<>();
		try {
			Metadata metadata = ImageMetadataReader.readMetadata(new ByteArrayInputStream(bytes));
			for (Directory diretorio : metadata.getDirectories()) {
				if (!diretorio.hasErrors()) continue;
				avisos.add("Alguns metadados da imagem estão inválidos e foram ignorados.");
				break;
			}
			BigDecimal[] coordenadas = extrairCoordenadas(metadata, avisos);
			DataCaptura captura = extrairData(metadata, avisos);
			return new Metadados(coordenadas[0], coordenadas[1], captura.data(), captura.hora(),
					captura.offset(), List.copyOf(avisos));
		} catch (Exception erro) {
			avisos.add("Não foi possível ler os metadados da imagem.");
			return new Metadados(null, null, null, null, null, List.copyOf(avisos));
		}
	}

	private BigDecimal[] extrairCoordenadas(Metadata metadata, List<String> avisos) {
		GpsDirectory gps = metadata.getFirstDirectoryOfType(GpsDirectory.class);
		if (gps == null) return new BigDecimal[] {null, null};
		GeoLocation local = gps.getGeoLocation();
		if (local == null || Double.isNaN(local.getLatitude()) || Double.isNaN(local.getLongitude())
				|| local.getLatitude() < -90 || local.getLatitude() > 90
				|| local.getLongitude() < -180 || local.getLongitude() > 180) {
			avisos.add("A localização EXIF está incompleta ou inválida.");
			return new BigDecimal[] {null, null};
		}
		return new BigDecimal[] {decimal(local.getLatitude()), decimal(local.getLongitude())};
	}

	private DataCaptura extrairData(Metadata metadata, List<String> avisos) {
		ExifSubIFDDirectory exif = metadata.getFirstDirectoryOfType(ExifSubIFDDirectory.class);
		if (exif == null) return new DataCaptura(null, null, null);
		String valor = exif.getString(ExifDirectoryBase.TAG_DATETIME_ORIGINAL);
		if (valor == null || valor.isBlank()) return new DataCaptura(null, null, null);
		try {
			LocalDateTime dataHora = LocalDateTime.parse(valor.trim(), DATA_EXIF);
			ZoneOffset offset = extrairOffset(exif.getString(ExifDirectoryBase.TAG_TIME_ZONE_ORIGINAL), avisos);
			return new DataCaptura(dataHora.toLocalDate(), dataHora.toLocalTime(), offset);
		} catch (DateTimeParseException erro) {
			avisos.add("A data EXIF é inválida e não foi utilizada.");
			return new DataCaptura(null, null, null);
		}
	}

	private ZoneOffset extrairOffset(String valor, List<String> avisos) {
		if (valor == null || valor.isBlank()) return null;
		try {
			return ZoneOffset.of(valor.trim());
		} catch (DateTimeException erro) {
			avisos.add("O fuso EXIF é inválido e não foi utilizado.");
			return null;
		}
	}

	private BigDecimal decimal(double valor) {
		return BigDecimal.valueOf(valor).setScale(7, java.math.RoundingMode.HALF_UP);
	}

	private record DataCaptura(LocalDate data, LocalTime hora, ZoneOffset offset) { }
}
