import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-contacto',
  standalone: true,
  templateUrl: './contacto.html',
  styleUrls: ['./contacto.scss']
})
export class ContactoComponent implements AfterViewInit, OnInit {
  loading = false;
  success = false;
  error = false;
  captchaError = false;
  fieldError: string | null = null;
  recaptchaLoaded = false;

  constructor(private title: Title) { }

  ngOnInit(): void {
    // Título de la pestaña para /contacto
    this.title.setTitle('Contacto');
  }

  ngAfterViewInit() {
    // Esperamos un poco a que Angular cargue el DOM
    setTimeout(() => this.renderCaptcha(), 300);
  }

  renderCaptcha() {
    const siteKey = '6LfniwYsAAAAAHHk755mmvDEjl4q3y94qkBXtYCf';
    const grecaptcha = (window as any).grecaptcha;

    if (grecaptcha && !this.recaptchaLoaded) {
      grecaptcha.render('recaptcha-container', { sitekey: siteKey });
      this.recaptchaLoaded = true;
      //console.log('✅ reCAPTCHA renderizado correctamente');
    } else if (!this.recaptchaLoaded) {
      //console.warn('⏳ reCAPTCHA aún no cargado, reintentando...');
      setTimeout(() => this.renderCaptcha(), 400);
    }
  }

  sendEmail(event: Event) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const nombre = (form.querySelector('#nombreContacto') as HTMLInputElement).value.trim();
    const correo = (form.querySelector('#correoContacto') as HTMLInputElement).value.trim();
    const asunto = (form.querySelector('#asuntoMensaje') as HTMLInputElement).value.trim();
    const mensaje = (form.querySelector('#textoMensaje') as HTMLTextAreaElement).value.trim();

    if (!nombre || !correo || !asunto || !mensaje) {
      this.fieldError = '⚠️ Por favor, rellena todos los campos antes de enviar.';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      this.fieldError = '⚠️ Introduce un correo electrónico válido.';
      return;
    }

    const captchaResponse = (window as any).grecaptcha?.getResponse();
    if (!captchaResponse) {
      this.captchaError = true;
      this.fieldError = null;
      return;
    } else {
      this.captchaError = false;
    }

    this.fieldError = null;
    this.loading = true;
    this.success = false;
    this.error = false;

    emailjs
      .sendForm('service_p1lnrxv', 'template_7yni2no', form, '-JfdI8WVNH1tMolim')
      .then(() => {
        this.loading = false;
        this.success = true;
        form.reset();
        (window as any).grecaptcha?.reset();
      })
      .catch(() => {
        this.loading = false;
        this.error = true;
      });
  }
}