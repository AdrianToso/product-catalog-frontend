import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../auth/auth.service';
import { ProductService } from '../product.service';
import { ProductsStateService } from '../../core/state/products-state.service';
import { of } from 'rxjs';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      imports: [
        MatDialogModule,
        MatPaginatorModule,
        MatCardModule,
        MatIconModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { 
          provide: AuthService, 
          useValue: { 
            roleSig: () => ['Admin'],
            isLoggedInSig: () => true
          } 
        },
        { 
          provide: ProductService, 
          useValue: {
            getProducts: () => of({ items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 1 }),
            deleteProduct: () => of({})
          }
        },
        { 
          provide: ProductsStateService, 
          useValue: {
            products$: of([]),
            loading$: of(false),
            error$: of(null),
            pagination$: of({ page: 1, pageSize: 10, totalCount: 0 }),
            setProducts: jest.fn(),
            setLoading: jest.fn(),
            setError: jest.fn(),
            setPagination: jest.fn()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize roles and permissions on ngOnInit', () => {
    expect(component.isAdmin).toBe(true);
    expect(component.isEditor).toBe(false);
    expect(component.canEdit).toBe(true);
    expect(component.products).toEqual([]);
    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe('');
  });

  it('should load products on page change', () => {
    const spySetProducts = jest.spyOn(component['productsState'], 'setProducts');
    const spySetPagination = jest.spyOn(component['productsState'], 'setPagination');
    const spySetLoading = jest.spyOn(component['productsState'], 'setLoading');

    component.onPageChange({ pageIndex: 1, pageSize: 10, length: 0 } as any);

    expect(spySetLoading).toHaveBeenCalledWith(true);
    expect(spySetProducts).toHaveBeenCalled();
    expect(spySetPagination).toHaveBeenCalledWith(2, 10, 0);
  });

  it('should open create dialog and reload products after close', () => {
    const dialogRefSpy = { afterClosed: () => of(true) };
    jest.spyOn(component['dialog'], 'open').mockReturnValue(dialogRefSpy as any);
    const spyLoadProducts = jest.spyOn(component, 'loadProducts');

    component.openCreateDialog();
    expect(component['dialog'].open).toHaveBeenCalled();
    expect(spyLoadProducts).toHaveBeenCalled();
  });

  it('should open edit dialog and reload products after close', () => {
    const dialogRefSpy = { afterClosed: () => of(true) };
    jest.spyOn(component['dialog'], 'open').mockReturnValue(dialogRefSpy as any);
    const spyLoadProducts = jest.spyOn(component, 'loadProducts');

    component.openEditDialog({ id: '1', name: 'Test' } as any);
    expect(component['dialog'].open).toHaveBeenCalled();
    expect(spyLoadProducts).toHaveBeenCalled();
  });

  it('should call deleteProduct when confirmDelete returns true', () => {
    const dialogRefSpy = { afterClosed: () => of(true) };
    jest.spyOn(component['dialog'], 'open').mockReturnValue(dialogRefSpy as any);
    const spyDeleteProduct = jest.spyOn(component as any, 'deleteProduct');

    component.confirmDelete({ id: '1', name: 'Test' } as any);
    expect(spyDeleteProduct).toHaveBeenCalledWith('1');
  });

  it('should not call deleteProduct when confirmDelete returns false', () => {
    const dialogRefSpy = { afterClosed: () => of(false) };
    jest.spyOn(component['dialog'], 'open').mockReturnValue(dialogRefSpy as any);
    const spyDeleteProduct = jest.spyOn(component as any, 'deleteProduct');

    component.confirmDelete({ id: '1', name: 'Test' } as any);
    expect(spyDeleteProduct).not.toHaveBeenCalled();
  });

  it('should call quickPurchase when onPurchase is called', () => {
    const dialogRefSpy = { afterClosed: () => of({ quantity: 2 }) };
    jest.spyOn(component['dialog'], 'open').mockReturnValue(dialogRefSpy as any);
    const spyQuickPurchase = jest.spyOn(component['purchaseService'], 'quickPurchase').mockReturnValue(of({ success: true, message: 'ok' }));

    component.onPurchase({ id: '1', name: 'Product' } as any);
    expect(spyQuickPurchase).toHaveBeenCalledWith('1', 2);
  });

  it('should handle processPurchase error', () => {
    const spyQuickPurchase = jest.spyOn(component['purchaseService'], 'quickPurchase').mockReturnValue(
      of({ success: false, message: 'fail' })
    );

    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    component['processPurchase']('1', 1);

    expect(spyQuickPurchase).toHaveBeenCalledWith('1', 1);
    expect(alertSpy).toHaveBeenCalledWith('Error: fail');
  });

});
