import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, Input, HostListener } from '@angular/core';

@Component({
  selector: 'app-before-after',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './before-after.html',
  styleUrls: ['./before-after.scss'],
})
export class BeforeAfterComponent {
  @Input() beforeSrc = '';
  @Input() afterSrc = '';
  @Input() beforeLabel = 'Antes';
  @Input() afterLabel = 'Después';

  @ViewChild('container', { static: true })
  containerRef!: ElementRef<HTMLDivElement>;

  dividerPosition = 50; // 0–100 %
  private isDragging = false;

  // pointerdown EN CUALQUIER PUNTO del slider
  onPointerDown(event: PointerEvent): void {
    this.isDragging = true;
    this.updateDividerPosition(event);
  }

  // soltar
  @HostListener('window:pointerup')
  onPointerUp(): void {
    this.isDragging = false;
  }

  // mover mientras está pulsado
  @HostListener('window:pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if (!this.isDragging) return;
    this.updateDividerPosition(event);
  }

  private updateDividerPosition(event: PointerEvent): void {
    const container = this.containerRef.nativeElement;
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;

    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;

    this.dividerPosition = percentage;
  }
}
