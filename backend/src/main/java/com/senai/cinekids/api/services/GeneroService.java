package com.senai.cinekids.api.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.senai.cinekids.api.entities.Genero;
import com.senai.cinekids.api.repositories.GeneroRepository;

@Service
public class GeneroService {
	
	@Autowired
	private GeneroRepository repository;
	
	public List<Genero> findAll(){
		return repository.findAll();
		
	}
	
	public Genero findById(Long id) {
		return repository.findById(id).orElse(null);
	}
	
	public Genero save(Genero genero) {
		return repository.save(genero);
	}
	
	public void delete(Long id) {
		repository.deleteById(id);
	}

}

