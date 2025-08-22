import { Component, OnInit, OnDestroy, effect } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Product } from '../models/product.model';
import { ProductService } from '../product.service';
import { AuthService } from '../../auth/auth.service';
import { ProductsStateService } from '../../core/state/products-state.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  private roleEffect = effect(() => {
    const roles = this.authService.roleSig();
    console.log('Roles actualizados en effect:', roles);
    this.isAdmin = Array.isArray(roles) ? roles.includes('Admin') : false;
    console.log('isAdmin establecido a:', this.isAdmin);
  });

  products: Product[] = [];
  totalCount = 0;
  pageSize = 10;
  pageNumber = 1;
  loading = false;
  errorMessage = '';

  isAdmin: boolean = false;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private productsState: ProductsStateService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const roles = this.authService.roleSig();
    this.isAdmin = Array.isArray(roles) ? roles.includes('Admin') : false;
    console.log('Roles en ngOnInit:', roles);
    console.log('isAdmin en ngOnInit:', this.isAdmin);

    this.subscriptions.add(
      this.productsState.products$.subscribe(products => {
        this.products = products;
      })
    );

    this.subscriptions.add(
      this.productsState.loading$.subscribe(loading => {
        this.loading = loading;
      })
    );

    this.subscriptions.add(
      this.productsState.error$.subscribe(error => {
        this.errorMessage = error || '';
      })
    );

    this.subscriptions.add(
      this.productsState.pagination$.subscribe(pagination => {
        this.pageNumber = pagination.page;
        this.pageSize = pagination.pageSize;
        this.totalCount = pagination.totalCount;
      })
    );

    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.roleEffect.destroy();
  }

  loadProducts(): void {
    this.productsState.setLoading(true);
    this.productService.getProducts(this.pageNumber, this.pageSize).subscribe({
      next: (paginatedResult) => {
        this.productsState.setProducts(paginatedResult.items);
        this.productsState.setPagination(
          this.pageNumber,
          this.pageSize,
          paginatedResult.totalCount
        );
        this.productsState.setLoading(false);
      },
      error: (error) => {
        this.productsState.setError(error.message);
        this.productsState.setLoading(false);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.productsState.setLoading(true);
    this.productService.getProducts(event.pageIndex + 1, event.pageSize).subscribe({
      next: (paginatedResult) => {
        this.productsState.setProducts(paginatedResult.items);
        this.productsState.setPagination(
          event.pageIndex + 1,
          event.pageSize,
          paginatedResult.totalCount
        );
        this.productsState.setLoading(false);
      },
      error: (error) => {
        this.productsState.setError(error.message);
        this.productsState.setLoading(false);
      }
    });
  }

  confirmDelete(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: { 
        title: 'Confirmar Eliminación', 
        message: `¿Está seguro de que desea eliminar el producto "${product.name}"?` 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteProduct(product.id);
      }
    });
  }

  private deleteProduct(id: string): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (err) => {
        console.error('Error al eliminar producto:', err);
      }
    });
  }
}