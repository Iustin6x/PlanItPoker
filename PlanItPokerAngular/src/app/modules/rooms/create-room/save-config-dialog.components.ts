import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-save-config-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule, // Adaugă acest import
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Save Card Configuration</h2>
    <mat-dialog-content>
      <mat-form-field>
        <input matInput [(ngModel)]="name" placeholder="Configuration name" required>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" [disabled]="!name" (click)="save()">Save</button>
    </mat-dialog-actions>
  `
})
export class SaveConfigDialogComponent {
  name = '';
  constructor(public dialogRef: MatDialogRef<SaveConfigDialogComponent>) {}

  save() {
    this.dialogRef.close(this.name);
  }
}