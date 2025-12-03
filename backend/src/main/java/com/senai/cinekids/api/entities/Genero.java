package com.senai.cinekids.api.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "tb_generos")
public class Genero {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotBlank(message = "O Nome Do Gênero É Obrigatório")
	@Column(name = "nome_genero", unique = true)
	private String nomeGenero;
	
	@Column(name = "descrição", unique = true)
	private String descricao;
	
	
	
	public Genero() {}



	public Long getId() {
		return id;
	}



	public void setId(Long id) {
		this.id = id;
	}



	public String getNomeGenero() {
		return nomeGenero;
	}



	public void setNomeGenero(String nomeGenero) {
		this.nomeGenero = nomeGenero;
	}



	public String getDescricao() {
		return descricao;
	}



	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}
	
}
