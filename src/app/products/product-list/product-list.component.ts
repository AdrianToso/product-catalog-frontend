import { Component, OnInit, OnDestroy, effect } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ProductFormDialogComponent, ProductFormDialogData } from '../product-form-dialog/product-form-dialog.component';
import { Product } from '../models/product.model';
import { ProductService } from '../product.service';
import { AuthService } from '../../auth/auth.service';
import { ProductsStateService } from '../../core/state/products-state.service';
import { Subscription } from 'rxjs';
import { PurchaseDialogComponent } from '../purchase-dialog/purchase-dialog.component';
import { PurchaseService } from '../services/purchase.service';

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
    this.isEditor = Array.isArray(roles) ? roles.includes('Editor') : false;
    this.canEdit = this.isAdmin || this.isEditor;
    console.log('Permisos establecidos - Admin:', this.isAdmin, 'Editor:', this.isEditor, 'Puede editar:', this.canEdit);
  });

  products: Product[] = [];
  totalCount = 0;
  pageSize = 10;
  pageNumber = 1;
  loading = false;
  errorMessage = '';

  isAdmin: boolean = false;
  isEditor: boolean = false;
  canEdit: boolean = false;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private purchaseService: PurchaseService,
    private productsState: ProductsStateService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const roles = this.authService.roleSig();
    this.isAdmin = Array.isArray(roles) ? roles.includes('Admin') : false;
    this.isEditor = Array.isArray(roles) ? roles.includes('Editor') : false;
    this.canEdit = this.isAdmin || this.isEditor;
    console.log('Roles en ngOnInit:', roles);
    console.log('Permisos en ngOnInit - Admin:', this.isAdmin, 'Editor:', this.isEditor, 'Puede editar:', this.canEdit);

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

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ProductFormDialogComponent, {
      width: '500px',
      data: {} as ProductFormDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts(); 
      }
    });
  }

  openEditDialog(product: Product): void {
    const dialogRef = this.dialog.open(ProductFormDialogComponent, {
      width: '500px',
      data: { product } as ProductFormDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts(); 
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

onPurchase(product: Product): void {
  const dialogRef = this.dialog.open(PurchaseDialogComponent, {
    width: '500px',
    data: { product }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.processPurchase(product.id, result.quantity);
    }
  });
}

 private processPurchase(productId: string, quantity: number): void {
  this.purchaseService.quickPurchase(productId, quantity).subscribe({
    next: (response) => {
      if (response.success) {
        console.log('Compra exitosa:', response.message);
        alert(`¡Compra exitosa! ${response.message}`);
      } else {
        console.error('Error en la compra:', response.message);
        alert(`Error: ${response.message}`);
      }
    },
    error: (error) => {
      console.error('Error al procesar la compra:', error);
      alert('Ocurrió un error al procesar tu compra. Por favor, intenta nuevamente.');
    }
  });
}
}