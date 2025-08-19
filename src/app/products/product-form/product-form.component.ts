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

  onSubmit(): void {
    if (this.productForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    if (this.isEditMode && this.productId) {
      const productData: UpdateProductDto = {
        ...this.productForm.value,
        id: this.productId
      };
      
      this.productService.updateProduct(this.productId, productData).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('Error al actualizar el producto', err);
          this.errorMessage = 'Error al actualizar el producto: ' + err.message;
          this.loading = false;
        }
      });
    } else {
      const productData: CreateProductDto = this.productForm.value;
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
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }
}