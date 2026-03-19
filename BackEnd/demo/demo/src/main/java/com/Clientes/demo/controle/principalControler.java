package com.Clientes.demo.controle;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class principalControler {
	@GetMapping ("/tela/home")
	public String acessarprincipal ()
	{
		return "Tela/home";
	}

}
