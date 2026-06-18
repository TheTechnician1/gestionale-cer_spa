import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit {
  displayDuration = 2500;
  fadeDuration = 700;
  fading = false;

  @Output() finished = new EventEmitter<void>();

  ngOnInit(): void {
    setTimeout(() => {
      this.fading = true;
      setTimeout(() => {
        this.finished.emit();
      }, this.fadeDuration);
    }, this.displayDuration);
  }
}
