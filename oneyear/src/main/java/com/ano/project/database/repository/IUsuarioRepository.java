package com.ano.project.database.repository;

import com.ano.project.database.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IUsuarioRepository extends JpaRepository<Usuario, UUID> {

	Optional<Usuario> findByLogin(String login);

	@Query("select u from Usuario u where u.login <> :login")
	List<Usuario> findParceiros(@Param("login") String login);
}
