import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ProductFormDialogComponent } from './product-form-dialog.component';
import { ProductService } from '../product.service';
import { CategoryService } from '../services/category.service';
import { MaterialModule } from '../../shared/material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ProductFormDialogComponent', () => {
  let component: ProductFormDialogComponent;
  let fixture: ComponentFixture<ProductFormDialogComponent>;
  let mockProductService: any;
  let mockCategoryService: any;
  let mockDialogRef: any;

  beforeEach(async () => {
    // Reemplazar jasmine.createSpyObj con objetos jest.fn()
    mockProductService = {
      createProduct: jest.fn(),
      updateProduct: jest.fn()
    };

    mockCategoryService = {
      getAllCategories: jest.fn()
    };

    mockDialogRef = {
      close: jest.fn()
    };

    // Configurar el mock para que devuelva un observable vacío
    mockCategoryService.getAllCategories.mockReturnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MaterialModule,
        NoopAnimationsModule
      ],
      declarations: [ProductFormDialogComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on init', () => {
    expect(mockCategoryService.getAllCategories).toHaveBeenCalled();
  });
});