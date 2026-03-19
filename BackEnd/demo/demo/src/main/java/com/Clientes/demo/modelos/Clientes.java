package com.Clientes.demo.modelos;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;



@Entity
@Table(name= "clientes")
public class Clientes implements Serializable {
	
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	
	private Long id;
	@Column(nullable = false, length = 100)
	private String nome;
	
	@Column(name = "dat_nasc")
	private LocalDate dataNascimento;
	
	@Column(unique = true, nullable = false, length = 11)
	private String cpf;
	
	@Column( unique = true, length = 150)
	private String email;
		
	@Column(name = "dtcreat", updatable = false)
	private LocalDateTime dtCriacao;
	
	private LocalDateTime dtAlt;
	
	protected void onCreate() {
        this.dtCriacao = LocalDateTime.now();
        this.dtAlt = LocalDateTime.now();
    }
	
	
	public Long getId() { return id; }
    public void setId(Long id) 
    { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome)
    { this.nome = nome; }

    public LocalDate getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(LocalDate dataNascimento) 
    { this.dataNascimento = dataNascimento; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf)
    { this.cpf = cpf; }

    public String getEmail() { return email; }
    public void setEmail(String email) 
    { this.email = email; }

    

    public LocalDateTime getDtCriacao() { return dtCriacao; }
    public LocalDateTime getDtAlt() 
    { return dtAlt; }
}


