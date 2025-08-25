import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from '../product.service';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { Product } from '../models/product.model';

export interface ProductFormDialogData {
  product?: Product; 
}

@Component({
  standalone: false,
  selector: 'app-product-form-dialog',
  templateUrl: './product-form-dialog.component.html',
  styleUrls: ['./product-form-dialog.component.scss']
})
export class ProductFormDialogComponent implements OnInit {
  productForm: FormGroup;
  categories: Category[] = [];
  loading = false;
  errorMessage = '';
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<ProductFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductFormDialogData
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      imageUrl: [''],
      categoryId: ['', Validators.required]
    });

    this.isEditMode = !!data?.product;
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.product) {
      this.loadProductForEdit();
    }
    this.loadCategories();
  }

  loadProductForEdit(): void {
    this.productForm.patchValue({
      name: this.data.product!.name,
      description: this.data.product!.description,
      imageUrl: this.data.product!.imageUrl,
      categoryId: this.data.product!.category.id
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => this.categories = categories,
      error: (err) => {
        console.error('Error al cargar las categorías', err);
        this.errorMessage = 'Error al cargar las categorías: ' + err.message;
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    if (this.isEditMode) {
      this.updateProduct();
    } else {
      this.createProduct();
    }
  }

  createProduct(): void {
    this.productService.createProduct(this.productForm.value).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error al crear el producto', err);
        this.errorMessage = 'Error al crear el producto: ' + err.message;
        this.loading = false;
      }
    });
  }

  updateProduct(): void {
    const productData = {
      ...this.productForm.value,
      id: this.data.product!.id
    };
    
    this.productService.updateProduct(this.data.product!.id, productData).subscribe({
      next: () => {
        this.dialogRef.close(true); 
      },
      error: (err) => {
        console.error('Error al actualizar el producto', err);
        this.errorMessage = 'Error al actualizar el producto: ' + err.message;
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false); 
  }
}