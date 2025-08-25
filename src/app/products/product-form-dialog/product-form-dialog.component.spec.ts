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
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockCategoryService: jasmine.SpyObj<CategoryService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ProductFormDialogComponent>>;

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', ['createProduct', 'updateProduct']);
    mockCategoryService = jasmine.createSpyObj('CategoryService', ['getAllCategories']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    // Configurar el mock para que devuelva un observable vacío
    mockCategoryService.getAllCategories.and.returnValue(of([]));

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