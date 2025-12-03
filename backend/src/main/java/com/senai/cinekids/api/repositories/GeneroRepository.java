package com.senai.cinekids.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.senai.cinekids.api.entities.Genero;

@Repository
public interface GeneroRepository extends JpaRepository<Genero, Long > {
	

}
