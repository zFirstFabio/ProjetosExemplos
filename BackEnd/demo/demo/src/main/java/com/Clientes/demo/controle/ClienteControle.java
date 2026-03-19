package com.Clientes.demo.controle;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.ModelAndView;

import com.Clientes.demo.modelos.Clientes;
import com.Clientes.demo.repositorios.ClientesRepositorio;

@Controller
public class ClienteControle {

    @Autowired
    private ClientesRepositorio clienteRepositorio;
    
	@GetMapping("/tela/clientes_geral/cadastro")
    public ModelAndView cadastrar(Clientes cliente) {
        ModelAndView mv = new ModelAndView("tela/clientes_geral/cadastro");
        mv.addObject("cliente", new Clientes()); 
        return mv;
    }
	
	
	@GetMapping("/tela/clientes_geral/pesquisar")
	 public ModelAndView pesquisar () {
		ModelAndView mv = new ModelAndView ("tela/clientes_geral/pesquisar");
		mv.addObject("pesquisarCliente", clienteRepositorio.findAll());
		 return mv;
		
	}
	
	
	@GetMapping("/editarcliente/{id}")
	public ModelAndView editar(@PathVariable("id") Long id) {
	    Optional<Clientes> clienteOptional = clienteRepositorio.findById(id);
	    // tratativa para verificar se o cliente existe
	    if (clienteOptional.isPresent()) {
	    	ModelAndView mv = new ModelAndView("Tela/clientes_geral/cadastro");
	    	mv.addObject("cliente", clienteOptional.get());
	    	return mv;
	    } else {
	    	// se nao existir, redirecionamos para pesquisa
	    	return new ModelAndView("redirect:/tela/clientes_geral/pesquisar");
	    }
	}
	
	
	@GetMapping("/excluircliente/{id}")
    public ModelAndView remover (@PathVariable ("id") Long id) { 
		Optional<Clientes> cliente = clienteRepositorio.findById(id);
		ModelAndView mv = new ModelAndView ("tela/clientes_geral/pesquisar");
		clienteRepositorio.delete(cliente.get());
		 return pesquisar();
		
	}
	
	@PostMapping("/salvarCliente")
	public ModelAndView salvar(@Validated Clientes cliente, BindingResult result) {
	    
	    if (result.hasErrors()) {
	        return cadastrar(cliente); 
	    }
	    
	   

	    if (clienteRepositorio.existsByCpf(cliente.getCpf()) && cliente.getId() == null) {
	        result.rejectValue("cpf", "error.cliente", "Este CPF já está cadastrado!");
	        return cadastrar(cliente);
	    }
	    
	    clienteRepositorio.saveAndFlush(cliente);
	    
	    return cadastrar (new Clientes ()); 
	}

}
