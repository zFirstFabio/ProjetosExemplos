import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../../models/cliente';
import { ClienteService } from '../../services/cliente';
import { CommonModule } from '@angular/common';
import { InputMaskModule } from 'primeng/inputmask';
import { ActivatedRoute, Router} from '@angular/router';
import { ButtonModule } from 'primeng/button';
// Alertas bonitos 
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-cadastro-cliente',
  standalone: true,
  imports: [FormsModule, CommonModule, InputMaskModule,ButtonModule, ToastModule, ConfirmDialogModule,InputTextModule ],

  providers: [MessageService,ConfirmationService],
  templateUrl: './cadastro-cliente.html',
  styleUrl: './cadastro-cliente.css',
})
export class CadastroClienteComponent implements OnInit {
  
  tituloTela: string = 'Cadastro de Cliente';

  // Criamos um cliente "em branco" para a tela preencher
  cliente: Cliente = {
    nome: '',
    cpf: '',
    dataNascimento: '',
    email: ''
  }; 

  constructor(
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    // Lê a URL para ver se veio algum "id" de carona
    const idQueVeioDaUrl = this.route.snapshot.paramMap.get('id');

    if (idQueVeioDaUrl) {
      // Se tem ID, o usuário clicou em "Editar"!
      this.tituloTela = 'Editando Cliente';
      
      // Chama o Java para buscar os dados desse cliente
      this.clienteService.buscarPorId(Number(idQueVeioDaUrl)).subscribe({
        next: (dadosDoBanco: any) => { 
          // Preenche a tela automaticamente com os dados do banco!
          this.cliente = dadosDoBanco; 
          this.cdr.detectChanges();
        },
        error: (erro: any) => console.error("Erro ao buscar cliente:", erro) 
      });
    }
  }


  salvarCliente(form: NgForm): void {
    // Validação de segurança antes de remover a pontuação do CPF
    if (this.cliente.cpf) {
        this.cliente.cpf = this.cliente.cpf.replace(/\D/g, '');
    }
    
    console.log("Envio para o Java:", this.cliente);

    this.clienteService.salvar(this.cliente).subscribe({
      next: (respostaDoJava: any) => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Sucesso', 
          detail: 'Cliente salvo com sucesso!' 
        });
        //alert('Cliente salvo com sucesso no banco de dados!');
      
        setTimeout(() => {
          form.resetForm();
          this.cliente = { nome: '', cpf: '', dataNascimento: '', email: '' };
        },10);
     
      
      },
      error: (erro: any) => {
        // O AVISO VERMELHO DE ERRO AQUI:
        let textoErro = 'Erro inesperado ao salvar o cliente.';
        if (erro.error && typeof erro.error === 'string') {
            textoErro = erro.error; // Pega a mensagem amigável do seu Java (ex: "CPF já existe")
        }

        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erro ao Salvar', 
          detail: textoErro 
        });
        console.error("Erro detalhado do Java:", erro);
      }
    });
  } 

  excluirCliente(): void {
    if (!this.cliente.id) return; 

    this.confirmationService.confirm({
      message: 'Certeza que deseja excluir permanentemente?',
      //header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, Excluir', 
      rejectLabel: 'Cancelar',      
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      
      accept: () => {
        // LÓGICA DE EXCLUIR: Só executa se o usuário clicar no botão "Sim, Excluir"
        this.clienteService.excluir(this.cliente.id!).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente excluído com sucesso!' });
            
            // Limpa o formulário após excluir
            setTimeout(() => {
              this.cliente = { nome: '', cpf: '', dataNascimento: '', email: '' };
            }, 1500);
          },


        error: (erro: any) => {
        // Balão vermelho de erro
        if (erro.error && typeof erro.error === 'string') {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: erro.error });
        } else {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao tentar excluir o cliente.' });
        }
        
        console.error("Erro detalhado:", erro);
        }
        });
      }
    });
  }

  avisarCpfBloqueado(): void {
    
    if (this.cliente.id) {
      this.messageService.add({ 
        severity: 'info', 
        summary: 'Aviso', 
        detail: 'Por motivos de segurança, o CPF não pode ser editado após o cadastro.' 
      });
    }
  }


}