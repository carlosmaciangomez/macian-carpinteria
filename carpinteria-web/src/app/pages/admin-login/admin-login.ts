import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminUsersService } from '../../services/admin-users.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.html',
  styleUrls: ['./admin-login.scss']
})
export class AdminLoginComponent implements OnInit {
  username = '';
  password = '';
  loading = false;
  errorMsg = '';

  constructor(
    private authService: AuthService,
    private adminUsers: AdminUsersService,
    private router: Router,
    private route: ActivatedRoute,
    private title: Title
  ) {
    // Si ya está logueado, lo mandamos directo al panel
    if (this.authService.isLoggedInSync()) {
      this.router.navigateByUrl('/admin-panel');
    }
  }

  ngOnInit(): void {
    this.title.setTitle('Acceso privado');
  }

  async onSubmit(form: NgForm) {
    this.errorMsg = '';

    if (form.invalid) {
      this.errorMsg = 'Por favor, rellena todos los campos.';
      return;
    }

    this.loading = true;

    const emailRaw = await this.adminUsers.getEmailByUsername(this.username);
    const email = (emailRaw ?? '').trim();

    if (!email) {
      this.loading = false;
      this.errorMsg = 'Usuario incorrecto.';
      return;
    }

    const ok = await this.authService.login(email, this.password);

    this.loading = false;

    if (!ok) {
      this.errorMsg = 'Usuario o contraseña incorrectos.';
      return;
    }

    const returnUrl =
      this.route.snapshot.queryParamMap.get('returnUrl') || '/admin-panel';
    this.router.navigateByUrl(returnUrl);
  }
}