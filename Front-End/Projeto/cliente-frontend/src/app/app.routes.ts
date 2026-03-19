import { Routes } from '@angular/router';

// O import precisa bater com o nome do arquivo TS da sua imagem
import { PesquisarClienteComponent } from './componentes/pesquisar-cliente/pesquisar-cliente';
import { CadastroClienteComponent } from './componentes/cadastro-cliente/cadastro-cliente';

import { Home } from './componentes/home/home';

export const routes: Routes = [
  // 1. Rota para a tela de Pesquisar
{ path: 'pesquisar', component: PesquisarClienteComponent },

  // (Deixaremos as rotas de Home e Cadastro comentadas até criarmos os arquivos delas)
   { path: 'home', component: Home },
   {path: 'cadastro', component: CadastroClienteComponent },
  { path: 'cadastro/:id', component: CadastroClienteComponent }
  // acesso direto ao home//
//{ path: '', redirectTo: 'home', pathMatch: 'full' }
];