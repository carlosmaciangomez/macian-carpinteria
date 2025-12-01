import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicios.html',
  styleUrls: ['./servicios.scss'],
})
export class ServiciosComponent {
  sliderPosition = 50;

  constructor(private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle('Servicios');
  }

  onSliderInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.sliderPosition = Number(input.value);
  }
}