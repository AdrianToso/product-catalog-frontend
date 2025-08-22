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
            setProducts: () => {},
            setLoading: () => {},
            setError: () => {},
            setPagination: () => {}
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
});