package com.senai.cinekids.api.services;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.senai.cinekids.api.entities.Filme;
import com.senai.cinekids.api.repositories.FilmeRepository;

@Service
public class FilmeServices {
	
	@Autowired
	private FilmeRepository repository;
	
	public List<Filme> listar(){
		return repository.findAll();
	}
	public Filme salvar(Filme filme) {
		return repository.save(filme);
	}

	public Filme buscarPorID(Long id) {
        Filme filme = repository.findById(id).orElse(null);

        return filme;
    }

    public Filme atualizar(Long id, Filme fNovo) {

        Filme fVelho = repository.findById(id).get();

        fVelho.setTitulo(fNovo.getTitulo());
        fVelho.setDescricao(fNovo.getDescricao());
        fVelho.setGenero(fNovo.getGenero());
        fVelho.setClassificacao(fNovo.getClassificacao());
        fVelho.setAnoLancamento(fNovo.getAnoLancamento());
        

        return repository.save(fVelho);

    }

    public String deletar(Long id) {
       Filme filme = buscarPorID(id);

        repository.delete(filme);

        return "Filme Com A ID" + id + "Foi Excluido";

    }

}
