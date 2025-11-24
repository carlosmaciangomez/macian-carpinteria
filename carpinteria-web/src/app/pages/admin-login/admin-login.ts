import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminUsersService } from '../../services/admin-users.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.html',
  styleUrls: ['./admin-login.scss']
})
export class AdminLoginComponent {
  username = '';
  password = '';
  loading = false;
  errorMsg = '';

  constructor(
    private authService: AuthService,
    private adminUsers: AdminUsersService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    if (this.authService.isLoggedInSync()) {
      this.router.navigateByUrl('/admin-panel');
    }
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