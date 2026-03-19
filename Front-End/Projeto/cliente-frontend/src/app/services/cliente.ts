import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  // API ECLIPSE JAVA
  private apiUrl = 'http://localhost:8081/api/clientes';

  // Injetamos REQUISICAO
  constructor(private http: HttpClient) { }
  salvar(cliente: Cliente): Observable<Cliente> {
    if (cliente.id) {
      // Se tem ID, o cliente já existe ele atualiza
      return this.http.put<Cliente>(`${this.apiUrl}/${cliente.id}`, cliente);
    } else {
      // Se não tem ID, é cliente novo
      return this.http.post<Cliente>(this.apiUrl, cliente);
    }
  }
  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  // Método que vai lá no Java buscar a lista de clientes
  listarTodos(): Observable<Cliente[]> {
    // Faz um GET na URL e espera receber um array de Clientes (JSON)
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  pesquisarPorNome(nome: string): Observable<Cliente[]> {
    // A crase (`) permite injetar a variável direto na URL
    return this.http.get<Cliente[]>(`${this.apiUrl}/pesquisar?nome=${nome}`);
  }
  buscarAniversariantes(mes: number): Observable<Cliente[]> {
  return this.http.get<Cliente[]>(`${this.apiUrl}/mes/${mes}`);
}
}