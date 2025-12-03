package com.senai.cinekids.api.entities;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "tb_filme")
public class Filme {

	@ManyToOne
	@JoinColumn(name = "fk_genero")
	private Genero genero;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_filme")
	private Long id;

	@NotBlank(message = "O Titulo Do Filme É Obrigatório")
	@Size(min = 2, max = 100, message = "O Titulo Deve Ter Entre 2 A 100 Caracteres")
	@Column(name = "titulo_filme", nullable = false, length = 100)
	private String titulo;

	@Size(min = 2, max = 400)
	@Column(name = "sinopse")
	private String sinopse;

	@Min(value = 1900, message = "O Ano De Lnacaçemtno Deve Ser Posterior A 1900")
	@Max(value = 2100, message = "O Ano De Lançamento Deve Ser Anterior A 2100")
	@Column(name = "ano_lancamento")
	private int anoLancamento;

	
	@Size(max = 100)
	@Column(name = "classificacao")
	private String classificacao;
	
	@Column(name = "idioma")
	private String idioma;

	public Filme() {
	}

	public Filme(String titulo, String sinopse, int anoLancamento, String classificacao, Genero genero) {
		this.titulo = titulo;
		this.sinopse = sinopse;
		this.anoLancamento = anoLancamento;
		this.classificacao = classificacao;

	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitulo() {
		return titulo;
	}

	public void setTitulo(String titulo) {
		this.titulo = titulo;
	}

	public String getDescricao() {
		return sinopse;
	}

	public void setDescricao(String descricao) {
		this.sinopse = descricao;
	}

	public int getAnoLancamento() {
		return anoLancamento;
	}

	public void setAnoLancamento(int anoLancamento) {
		this.anoLancamento = anoLancamento;
	}

	public String getClassificacao() {
		return classificacao;
	}

	public void setClassificacao(String classificacao) {
		this.classificacao = classificacao;
	}

	public Genero getGenero() {
		return genero;
	}

	public void setGenero(Genero genero) {
		this.genero = genero;
	}
}
