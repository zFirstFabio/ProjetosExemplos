import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Cliente } from '../../models/cliente';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../services/cliente';
//import { ProductService } from './productService';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { Button } from "primeng/button";
import { InputTextModule } from 'primeng/inputtext';
import { CpfPipe } from '../../pipes/cpf.pipe';
import { Router } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-pesquisar-cliente',
  standalone: true,
  imports: [TableModule, FormsModule, CommonModule, Button,InputTextModule,CpfPipe,ConfirmDialogModule, ToastModule],
  providers: [ ConfirmationService, MessageService ],
  templateUrl: './pesquisar-cliente.html'
})
export class PesquisarClienteComponent implements OnInit {
  
  // Variável que vai guardar a lista que vem do Java
  clientes: Cliente[] = [];
  termoBusca: string = '';
  mesSelecionado: string = '';  

  constructor(private clienteService: ClienteService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
    //,private prod:ProductService
  ) {}

  // Esse método roda automaticamente assim que a tela abre
  ngOnInit(): void {
console.log("2. ngOnInit foi chamado! Buscando dados...");
    this.carregarClientesDoBanco();
  }

  carregarClientesDoBanco(): void {
    this.clienteService.listarTodos().subscribe({
      next: (dados) => {
        console.log("3. Dados chegaram do Java:", dados);
        
        // A SOLUÇÃO DEFINITIVA:
        // O setTimeout tira a execução do ciclo atual e joga para o próximo respiro do navegador
        setTimeout(() => {
            this.clientes = dados;
            this.cdr.detectChanges(); // Força a atualização visual com segurança
        }, 1); 
      },
      error: (erro) => {
        console.error('Erro ao buscar clientes:', erro);
        alert("Sem resposta do servidor! Verifique se o Java está rodando.");
      }
    });
  }
  editar(cliente: Cliente): void {
    // Isso vai mudar a barra de endereço para: /cadastro/5
    this.router.navigate(['/cadastro', cliente.id]);
    error: (erro: any) => {
        console.error('Erro ao tentar editar:', erro);
        alert(' Olhe console.');
    }
  }
  
  excluir(id: number): void {
    // Modal do PrimeNG
    this.confirmationService.confirm({
      message: 'Certeza que deseja excluir permanentemente?',
      //header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',

      
      accept: () => {
        // chamada do service
        this.clienteService.excluir(id).subscribe({
          next: () => {
            //sucesso Toast verde
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente excluído com sucesso!' });
            
            // Recarrega a tabela 
            this.pesquisar(); 
          },
          error: (erro: any) => {
            //mensagem do Java
            if (erro.error && typeof erro.error === 'string') {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: erro.error });
            } else {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao tentar excluir o cliente.' });
            }
            console.error("Erro ao excluir:", erro);
          }
        });
      }
    });
  }

  //botão "Buscar" vai chamar
  pesquisar(): void {
    if (this.termoBusca.trim() === '') {
      this.carregarClientesDoBanco();
      return; 
    }

    this.clienteService.pesquisarPorNome(this.termoBusca).subscribe({
      // CORREÇÃO 1: Avisamos que a variável é do tipo Cliente[]
      next: (dadosFiltrados: Cliente[]) => {
        console.log("Dados da Pesquisa chegaram:", dadosFiltrados); 
       
        setTimeout(() => {
            this.clientes = dadosFiltrados;
            this.cdr.detectChanges(); // Atualiza a tela na hora!
        }, 1);
      },
      // CORREÇÃO 2: Avisamos que o erro é do tipo genérico 'any' (ou HttpErrorResponse)
      error: (erro: any) => {
        console.error('Erro na pesquisa:', erro);
        alert('Falha ao pesquisar. Olhe console.');
      }
    });
  }
  // 2. Crie a função nova de pesquisa
pesquisarPorMes(): void {
  if (!this.mesSelecionado) {
    alert("Escolha um mês!");
    return;
  }

  // chama o serviço
  this.clienteService.buscarAniversariantes(+this.mesSelecionado).subscribe({
    next: (dados) => {
      // setTimeout para atualizar a tela
      setTimeout(() => {
        this.clientes = dados;
        this.cdr.detectChanges();
      }, 1);
    },
    error: (erro) => {
        console.error("Erro vindo do Java:", erro);
        alert("Olhe o F12 (Console).");
    }
  });

}



}