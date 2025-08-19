import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Product } from '../models/product.model';
import { ProductService } from '../product.service';
import { finalize } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  standalone: false,
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  loading = false;
  products: Product[] = [];
  totalCount = 0;
  pageSize = 10;
  pageNumber = 1;
  errorMessage = '';

  isAdmin: boolean;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.isAdmin = this.authService.isAdmin();
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';
    this.productService.getProducts(this.pageNumber, this.pageSize)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (response) => {
          this.products = response.items;
          this.totalCount = response.totalCount;
        },
        error: (err) => {
          this.errorMessage = err.message;
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex + 1;
    this.loadProducts();
  }

  confirmDelete(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: { title: 'Confirmar Eliminación', message: `¿Está seguro de que desea eliminar el producto "${product.name}"?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteProduct(product.id);
      }
    });
  }

  private deleteProduct(id: string): void {
    this.loading = true;
    this.productService.deleteProduct(id)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (err) => {
          this.errorMessage = `Error al eliminar: ${err.message}`;
        }
      });
  }
}