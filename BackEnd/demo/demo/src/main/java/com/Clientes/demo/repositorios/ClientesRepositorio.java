package com.Clientes.demo.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Clientes.demo.modelos.Clientes;
import java.util.Optional;

public interface ClientesRepositorio extends JpaRepository<Clientes, Long> {

	
	
	
	Optional<Clientes> findByCpf(String cpf);
	boolean existsByCpf(String cpf);
}
