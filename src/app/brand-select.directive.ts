import { Directive, ElementRef, HostBinding, HostListener, inject } from '@angular/core';

@Directive({
  selector: 'select',
  standalone: true
})
export class BrandSelectDirective {
  private readonly element = inject<ElementRef<HTMLSelectElement>>(ElementRef);
  private open = false;

  @HostBinding('class.brand-dropdown')
  get brandDropdown(): boolean {
    return !this.element.nativeElement.multiple;
  }

  @HostBinding('class.select-open')
  get selectOpen(): boolean {
    return this.open && !this.element.nativeElement.multiple;
  }

  @HostListener('pointerdown')
  onPointerDown(): void {
    if (this.element.nativeElement.multiple) return;
    this.open = !this.open;
  }

  @HostListener('change')
  @HostListener('blur')
  close(): void {
    this.open = false;
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (this.element.nativeElement.multiple) return;
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
      this.open = true;
    }
    if (event.key === 'Escape' || event.key === 'Tab') {
      this.open = false;
    }
  }
}
