package com.ano.project.database.repository;

import com.ano.project.database.models.Foto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface IFotoRepository extends JpaRepository<Foto, UUID> {

	boolean existsByStorageKey(String storageKey);

	@Query("""
			select f from Foto f
			where (:ano is null or year(f.dataCaptura) = :ano)
			order by case when f.dataCaptura is null then 1 else 0 end,
			f.dataCaptura, f.criadoEm, f.id
			""")
	Page<Foto> buscarGaleria(@Param("ano") Integer ano, Pageable pageable);

	@Query("""
			select f from Foto f
			where f.latitude is not null and f.longitude is not null
			order by f.id
			""")
	Page<Foto> buscarPins(Pageable pageable);

	@Query("""
			select distinct year(f.dataCaptura) from Foto f
			where f.dataCaptura is not null
			order by year(f.dataCaptura)
			""")
	List<Integer> buscarAnos();
}
