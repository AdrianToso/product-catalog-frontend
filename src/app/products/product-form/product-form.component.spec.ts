import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProductFormComponent } from './product-form.component';
import { ProductService } from '../product.service';
import { CategoryService } from '../services/category.service';
import { MaterialModule } from '../../shared/material.module';
import { Category } from '../models/category.model';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let mockProductService: any;
  let mockCategoryService: any;

  const mockCategory: Category = {
    id: '1',
    name: 'Test Category',
    description: 'Test Description'
  };

  beforeEach(async () => {
    // Reemplazar jasmine.createSpyObj con objetos jest.fn()
    mockProductService = {
      getProductById: jest.fn(),
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
      createProductWithImage: jest.fn(),
      updateProductImage: jest.fn()
    };

    mockCategoryService = {
      getAllCategories: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [ProductFormComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        MaterialModule
      ],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: CategoryService, useValue: mockCategoryService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on init', () => {
    // Cambiar and.returnValue por mockReturnValue
    mockCategoryService.getAllCategories.mockReturnValue(of([mockCategory]));
    fixture.detectChanges();
    
    expect(mockCategoryService.getAllCategories).toHaveBeenCalled();
  });

  it('should handle file selection with valid image', () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const input = document.createElement('input');
    input.type = 'file';
    Object.defineProperty(input, 'files', {
        value: [file]
    });
    const event = { target: input } as unknown as Event;
    
    component.onFileSelected(event);
    
    expect(component.selectedFile).toBe(file);
    expect(component.errorMessage).toBe('');
  });

  it('should show error for non-image file', () => {
    const file = new File([''], 'test.txt', { type: 'text/plain' });
    const input = document.createElement('input');
    input.type = 'file';
    Object.defineProperty(input, 'files', {
        value: [file]
    });
    const event = { target: input } as unknown as Event;

    component.onFileSelected(event);
    
    expect(component.selectedFile).toBeNull();
    expect(component.errorMessage).toContain('Solo se permiten archivos de imagen');
  });
});