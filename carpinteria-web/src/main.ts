import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .then(() => {
    // Cuando Angular termina de cargar, activamos animación sin flash
    window.addEventListener("load", () => {
      document.body.classList.add("loaded");
    });
  })
  .catch((err) => console.error(err));
