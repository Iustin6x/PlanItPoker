import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}
  showError(message: string, duration: number = 5000) {
    this.snackBar.open(message, 'Close', {
      duration,
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  showSuccess(message: string, duration: number = 3000) {
    this.snackBar.open(message, '', {
      duration,
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }
}
