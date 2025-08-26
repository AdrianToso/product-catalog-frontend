import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../product.service';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { CreateProductDto } from '../models/create-product.dto';
import { UpdateProductDto } from '../models/update-product.dto';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  categories: Category[] = [];
  loading = false;
  errorMessage = '';
  isEditMode = false;
  productId: string | null = null;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      imageUrl: [''],
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      this.isEditMode = !!this.productId;
      
      if (this.isEditMode && this.productId) {
        this.loadProductForEdit();
      }
    });
    this.loadCategories();
  }

  loadProductForEdit(): void {
    this.loading = true;
    this.productService.getProductById(this.productId!).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          imageUrl: product.imageUrl,
          categoryId: product.category.id
        });

        if (product.imageUrl) {
          this.imagePreview = product.imageUrl;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar el producto', err);
        this.errorMessage = 'Error al cargar el producto: ' + err.message;
        this.loading = false;
      }
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
          this.router.navigate(['/products']);
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
      id: this.productId!,
      name: productData.name,
      description: productData.description,
      categoryId: productData.categoryId,
      imageUrl: productData.imageUrl
    };

    this.productService.updateProduct(this.productId!, updateData).subscribe({
      next: () => {
        if (this.selectedFile) {
          this.productService.updateProductImage(this.productId!, this.selectedFile).subscribe({
            next: () => {
              this.router.navigate(['/products']);
            },
            error: (err) => {
              console.error('Error al actualizar la imagen', err);
              this.errorMessage = 'Error al actualizar la imagen: ' + err.message;
              this.loading = false;
            }
          });
        } else {
          this.router.navigate(['/products']);
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
        this.router.navigate(['/products']);
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
      id: this.productId!
    };
    
    this.productService.updateProduct(this.productId!, productData).subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Error al actualizar el producto', err);
        this.errorMessage = 'Error al actualizar el producto: ' + err.message;
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }
}