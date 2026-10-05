package com.ano.project.database.repository;

import com.ano.project.database.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface IUsuarioRepository extends JpaRepository<Usuario, UUID> {

	Optional<Usuario> findByLogin(String login);
}
