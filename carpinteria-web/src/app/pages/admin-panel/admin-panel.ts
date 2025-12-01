import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-panel.html',
  styleUrls: ['./admin-panel.scss']
})
export class AdminPanelComponent implements OnInit, OnDestroy {

  private sub?: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router,
    private title: Title
  ) { }

  ngOnInit(): void {
    // Título de la pestaña para el panel
    this.title.setTitle('Panel de administración');

    // Proteger la ruta: si no hay usuario, redirigir a login
    this.sub = this.auth.user$.subscribe(user => {
      if (!user) this.router.navigateByUrl('/admin-login');
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    this.router.navigateByUrl('/admin-login');
  }
}