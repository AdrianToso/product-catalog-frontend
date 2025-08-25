import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../models/product.model';

export interface PurchaseDialogData {
  product: Product;
}

@Component({
  standalone: false,
  selector: 'app-purchase-dialog',
  templateUrl: './purchase-dialog.component.html',
  styleUrls: ['./purchase-dialog.component.scss']
})
export class PurchaseDialogComponent {
  purchaseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PurchaseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PurchaseDialogData
  ) {
    this.purchaseForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1), Validators.max(100)]]
    });
  }

  onConfirm(): void {
    if (this.purchaseForm.valid) {
      this.dialogRef.close(this.purchaseForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  get totalPrice(): number {
    // Por ahora, solo devolvemos la cantidad como placeholder
    return this.purchaseForm.get('quantity')?.value || 0;
  }
}