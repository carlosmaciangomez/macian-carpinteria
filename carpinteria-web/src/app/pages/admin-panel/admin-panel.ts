import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  templateUrl: './admin-panel.html',
  styleUrls: ['./admin-panel.scss']
})
export class AdminPanelComponent implements OnInit, OnDestroy {

  private sub?: Subscription;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Si Firebase detecta que ya no hay usuario, te saca del panel
    this.sub = this.auth.user$.subscribe(user => {
      if (!user) {
        this.router.navigateByUrl('/admin-login');
      }
    });
  }

  ngOnDestroy(): void {
    // Cortamos la suscripción al salir del componente
    this.sub?.unsubscribe();
  }

  async logout(): Promise<void> {
    // Espera a que Firebase cierre sesión bien
    await this.auth.logout();

    // Y sales del panel al momento (sin hacer F5)
    this.router.navigateByUrl('/admin-login');
  }
}
