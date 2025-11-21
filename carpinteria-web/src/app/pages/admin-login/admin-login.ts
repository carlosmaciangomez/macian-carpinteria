import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/admin-panel');
    }
  }

  onSubmit(form: NgForm) {
    this.errorMsg = '';

    if (form.invalid) {
      this.errorMsg = 'Por favor, rellena todos los campos.';
      return;
    }

    this.loading = true;

    const ok = this.authService.login(this.username, this.password);

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