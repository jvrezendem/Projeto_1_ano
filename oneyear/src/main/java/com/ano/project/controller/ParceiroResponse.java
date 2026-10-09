package com.ano.project.controller;

import java.util.List;
import java.util.UUID;

public record ParceiroResponse(UUID id, String nome, List<String> gostos) {
}
