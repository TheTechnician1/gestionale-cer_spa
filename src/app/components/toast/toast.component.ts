import { Component } from '@angular/core';

import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  toast$ = this.toastService.toast$;

  constructor(public toastService: ToastService) {}

  chiudiToast(): void {
    this.toastService.chiudiToast();
  }
}
