import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-confirm-dialog',
  template: `
    <div class="p-4">
      <h2 class="text-lg font-semibold mb-3">{{ data.title }}</h2>
      <p class="mb-4">{{ data.message }}</p>
      <div class="text-right">
        <button mat-button (click)="onCancel()" color="primary">{{ data.cancelText || 'Cancel' }}</button>
        <button mat-button (click)="onConfirm()" color="warn">{{ data.confirmText || 'OK' }}</button>
      </div>
    </div>
  `,
  styles: [`
    h2 {
      margin: 0;
    }
  `],
  imports: [
    CommonModule,
    MatButtonModule
  ]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string;
      message: string;
      confirmText?: string;
      cancelText?: string;
    }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
