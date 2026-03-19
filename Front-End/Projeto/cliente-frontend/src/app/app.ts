import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router'; 



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'sistema-frontend';

  constructor(private router: Router) {}

  navegarPara(rota: string) {
    
    
    this.router.navigate([rota]); 
  }
  isRotaAtiva(rota: string): boolean {
    return this.router.url === rota;
  }
}