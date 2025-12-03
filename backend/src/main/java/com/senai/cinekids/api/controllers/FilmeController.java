package com.senai.cinekids.api.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.senai.cinekids.api.entities.Filme;
import com.senai.cinekids.api.services.FilmeServices;
import jakarta.validation.Valid;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/filmes")
public class FilmeController {
	
	
	@Autowired
	private FilmeServices service;
	
	@GetMapping
	public List<Filme> listar(){
		return service.listar();
	}
	
	@PostMapping
	public Filme cadastrar (@Valid @RequestBody Filme filme) {
		return service.salvar(filme);
	}

	
}
