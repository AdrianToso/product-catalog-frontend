import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from '../product.service';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { Product } from '../models/product.model';
import { CreateProductDto } from '../models/create-product.dto';
import { UpdateProductDto } from '../models/update-product.dto';

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
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

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

    if (this.data.product!.imageUrl) {
      this.imagePreview = this.data.product!.imageUrl;
    }
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      if (!file.type.match('image.*')) {
        this.errorMessage = 'Solo se permiten archivos de imagen.';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'La imagen no puede superar los 5MB.';
        return;
      }

      this.selectedFile = file;
      this.errorMessage = '';

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.productForm.patchValue({ imageUrl: '' });
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const formValue = this.productForm.value;

    if (this.selectedFile) {
      this.createOrUpdateWithImage(formValue);
    } else if (this.isEditMode) {
      this.updateProduct(formValue);
    } else {
      this.createProduct(formValue);
    }
  }

  private createOrUpdateWithImage(formValue: CreateProductDto): void {
    const productData: CreateProductDto = {
      name: formValue.name,
      description: formValue.description,
      categoryId: formValue.categoryId,
      imageUrl: formValue.imageUrl
    };

    if (this.isEditMode) {
      this.updateProductAndImage(productData);
    } else {
      this.productService.createProductWithImage(productData, this.selectedFile!).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al crear el producto con imagen', err);
          this.errorMessage = 'Error al crear el producto: ' + err.message;
          this.loading = false;
        }
      });
    }
  }

  private updateProductAndImage(productData: CreateProductDto): void {
    const updateData: UpdateProductDto = {
      id: this.data.product!.id,
      name: productData.name,
      description: productData.description,
      categoryId: productData.categoryId,
      imageUrl: productData.imageUrl
    };

    this.productService.updateProduct(this.data.product!.id, updateData).subscribe({
      next: () => {
        if (this.selectedFile) {
          this.productService.updateProductImage(this.data.product!.id, this.selectedFile).subscribe({
            next: () => {
              this.dialogRef.close(true);
            },
            error: (err) => {
              console.error('Error al actualizar la imagen', err);
              this.errorMessage = 'Error al actualizar la imagen: ' + err.message;
              this.loading = false;
            }
          });
        } else {
          this.dialogRef.close(true);
        }
      },
      error: (err) => {
        console.error('Error al actualizar el producto', err);
        this.errorMessage = 'Error al actualizar el producto: ' + err.message;
        this.loading = false;
      }
    });
  }

  private createProduct(formValue: CreateProductDto): void {
    const productData: CreateProductDto = formValue;
    this.productService.createProduct(productData).subscribe({
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

  private updateProduct(formValue: UpdateProductDto): void {
    const productData: UpdateProductDto = {
      ...formValue,
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