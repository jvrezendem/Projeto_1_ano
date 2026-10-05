package com.ano.project.controller;

import com.fasterxml.jackson.annotation.JsonSetter;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public class FotoPatchRequest {

	private String legenda;
	private String lugar;
	private BigDecimal latitude;
	private BigDecimal longitude;
	private LocalDate dataCaptura;
	private boolean legendaInformada;
	private boolean lugarInformado;
	private boolean latitudeInformada;
	private boolean longitudeInformada;
	private boolean dataCapturaInformada;

	@Size(max = 500)
	public String getLegenda() { return legenda; }

	@Size(max = 120)
	public String getLugar() { return lugar; }

	@DecimalMin("-90") @DecimalMax("90")
	public BigDecimal getLatitude() { return latitude; }

	@DecimalMin("-180") @DecimalMax("180")
	public BigDecimal getLongitude() { return longitude; }

	public LocalDate getDataCaptura() { return dataCaptura; }
	public boolean isLegendaInformada() { return legendaInformada; }
	public boolean isLugarInformado() { return lugarInformado; }
	public boolean isLatitudeInformada() { return latitudeInformada; }
	public boolean isLongitudeInformada() { return longitudeInformada; }
	public boolean isDataCapturaInformada() { return dataCapturaInformada; }

	@JsonSetter
	public void setLegenda(String legenda) { this.legenda = legenda; this.legendaInformada = true; }

	@JsonSetter
	public void setLugar(String lugar) { this.lugar = lugar; this.lugarInformado = true; }

	@JsonSetter
	public void setLatitude(BigDecimal latitude) { this.latitude = latitude; this.latitudeInformada = true; }

	@JsonSetter
	public void setLongitude(BigDecimal longitude) { this.longitude = longitude; this.longitudeInformada = true; }

	@JsonSetter
	public void setDataCaptura(LocalDate dataCaptura) { this.dataCaptura = dataCaptura; this.dataCapturaInformada = true; }
}
