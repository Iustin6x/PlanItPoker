import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-quick-play',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quick-play.component.html',
  styleUrls: ['./quick-play.component.scss']
})
export class QuickPlayComponent {
  authService = inject(AuthService);
  router = inject(Router);
  playerName = '';
  errorMessage = signal<string | null>(null);
  private activatedRoute = inject(ActivatedRoute);
  protected returnUrl = this.authService.returnUrl;


  handleJoin() {
    this.errorMessage.set(null);

    if (!this.playerName.trim()) {
      this.errorMessage.set('Please enter a name');
      return;
    }

    this.authService.quickplay(this.playerName).subscribe({
      next: () => this.router.navigateByUrl(this.returnUrl().toString()),
      error: (err) => {
        this.errorMessage.set('Error joining the game');
        console.error('Quickplay error:', err);
      }
    });
  }
}