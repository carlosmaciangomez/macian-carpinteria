import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-panel.html',
  styleUrls: ['./admin-panel.scss']
})
export class AdminPanelComponent implements OnInit, OnDestroy {

  private sub?: Subscription;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
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