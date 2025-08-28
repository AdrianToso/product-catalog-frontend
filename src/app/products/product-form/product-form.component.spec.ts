import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { ProductFormComponent } from './product-form.component';
import { ProductService } from '../product.service';
import { CategoryService } from '../services/category.service';
import { MaterialModule } from '../../shared/material.module';
import { Category } from '../models/category.model';
import { Product } from '../models/product.model';

describe('ProductFormComponent', () => {
  let fixture: ComponentFixture<ProductFormComponent>;
  let component: ProductFormComponent;
  let router: Router;

  let mockProductService: Record<string, jest.Mock>;
  let mockCategoryService: Record<string, jest.Mock>;

  const mockCategory: Category = {
    id: '1',
    name: 'Test Category',
    description: 'Test Description',
  };

  const mockProduct: Product = {
    id: '10',
    name: 'Product 1',
    description: 'Desc 1',
    imageUrl: 'url.jpg',
    category: mockCategory,
  } as unknown as Product;

  beforeEach(async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    mockProductService = {
      getProductById: jest.fn(),
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
      createProductWithImage: jest.fn(),
      updateProductImage: jest.fn(),
    };

    mockCategoryService = {
      getAllCategories: jest.fn().mockReturnValue(of([mockCategory])),
    };

    await TestBed.configureTestingModule({
      declarations: [ProductFormComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        NoopAnimationsModule,
        MaterialModule,
      ],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: CategoryService, useValue: mockCategoryService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on init', () => {
    expect(mockCategoryService['getAllCategories']).toHaveBeenCalled();
    expect(component.categories.length).toBe(1);
    expect(component.categories[0].name).toBe('Test Category');
  });

  // -------------------------
  // FILE SELECTION MOCK
  // -------------------------
  describe('file selection', () => {
    let originalFileReader: any;

    beforeEach(() => {
      originalFileReader = (global as any).FileReader;

      class MockFileReader {
        result: string | ArrayBuffer | null = null;
        onload: ((ev: ProgressEvent<FileReader>) => void) | null = null;
        readAsDataURL(_file: Blob) {
          this.result = 'data:image/png;base64,TEST';
          if (this.onload) {
            this.onload({} as ProgressEvent<FileReader>);
          }
        }
      }

      (global as any).FileReader = MockFileReader;
    });

    afterEach(() => {
      (global as any).FileReader = originalFileReader;
    });

    it('accepts valid image file and sets preview', () => {
      const file = new File(['dummy'], 'test.png', { type: 'image/png' });
      const event = { target: { files: [file] } } as unknown as Event;

      component.onFileSelected(event);

      expect(component.selectedFile).toBe(file);
      expect(component.errorMessage).toBe('');
      expect(component.imagePreview).toContain('data:image/png;base64,TEST');
    });

    it('rejects non-image file', () => {
      const file = new File(['txt'], 'file.txt', { type: 'text/plain' });
      const input = document.createElement('input');
      Object.defineProperty(input, 'files', { value: [file] });
      const event = { target: input } as unknown as Event;

      component.onFileSelected(event);

      expect(component.selectedFile).toBeNull();
      expect(component.errorMessage).toContain('Solo se permiten archivos de imagen');
    });

    it('rejects large image file', () => {
      const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], 'big.png', {
        type: 'image/png',
      });
      const input = document.createElement('input');
      Object.defineProperty(input, 'files', { value: [largeFile] });
      const event = { target: input } as unknown as Event;

      component.onFileSelected(event);

      expect(component.selectedFile).toBeNull();
      expect(component.errorMessage).toContain('La imagen no puede superar los 5MB');
    });
  });

  // -------------------------
  // FORM SUBMIT TESTS
  // -------------------------
  describe('submit flows', () => {
    beforeEach(() => {
      component.productForm.setValue({
        name: 'A',
        description: 'B',
        imageUrl: '',
        categoryId: '1',
      });
    });

    it('creates product without image and navigates', () => {
      mockProductService['createProduct'].mockReturnValue(of({}));
      const navSpy = jest
        .spyOn(router, 'navigate')
        .mockImplementation(() => Promise.resolve(true) as any);

      component.isEditMode = false;
      component.selectedFile = null;
      component.onSubmit();

      expect(mockProductService['createProduct']).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'A',
          description: 'B',
          categoryId: '1',
        })
      );
      expect(navSpy).toHaveBeenCalledWith(['/products']);
    });

    it('creates product with image and navigates', () => {
      const file = new File(['f'], 'i.png', { type: 'image/png' });
      mockProductService['createProductWithImage'].mockReturnValue(of({}));
      const navSpy = jest
        .spyOn(router, 'navigate')
        .mockImplementation(() => Promise.resolve(true) as any);

      component.isEditMode = false;
      component.selectedFile = file;
      component.onSubmit();

      expect(mockProductService['createProductWithImage']).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'A',
          description: 'B',
          categoryId: '1',
        }),
        file
      );
      expect(navSpy).toHaveBeenCalledWith(['/products']);
    });

    it('updates product without image and navigates', () => {
      mockProductService['updateProduct'].mockReturnValue(of({}));
      const navSpy = jest
        .spyOn(router, 'navigate')
        .mockImplementation(() => Promise.resolve(true) as any);

      component.isEditMode = true;
      component.productId = '10';
      component.selectedFile = null;
      component.onSubmit();

      expect(mockProductService['updateProduct']).toHaveBeenCalled();
      expect(navSpy).toHaveBeenCalledWith(['/products']);
    });

    it('updates product with image and navigates', () => {
      const file = new File(['f'], 'i.png', { type: 'image/png' });
      mockProductService['updateProduct'].mockReturnValue(of({}));
      mockProductService['updateProductImage'].mockReturnValue(of({}));
      const navSpy = jest
        .spyOn(router, 'navigate')
        .mockImplementation(() => Promise.resolve(true) as any);

      component.isEditMode = true;
      component.productId = '10';
      component.selectedFile = file;
      component.onSubmit();

      expect(mockProductService['updateProduct']).toHaveBeenCalled();
      expect(mockProductService['updateProductImage']).toHaveBeenCalledWith('10', file);
      expect(navSpy).toHaveBeenCalledWith(['/products']);
    });

    it('handles create error and sets errorMessage', () => {
      const err = new Error('boom');
      mockProductService['createProduct'].mockReturnValue(throwError(() => err));

      component.isEditMode = false;
      component.selectedFile = null;
      component.onSubmit();

      expect(component.errorMessage).toContain('Error al crear el producto');
      expect(component.loading).toBe(false);
    });
  });

  // -------------------------
  // LOAD / REMOVE / CANCEL
  // -------------------------
  it('loadProductForEdit patches form on success', () => {
    mockProductService['getProductById'].mockReturnValue(of(mockProduct));
    component.productId = '10';
    component.isEditMode = true;

    component.loadProductForEdit();

    expect(component.productForm.value.name).toBe(mockProduct.name);
    expect(component.imagePreview).toBe(mockProduct.imageUrl);
    expect(component.loading).toBe(false);
  });

  it('loadProductForEdit sets errorMessage on failure', () => {
    const err = new Error('not found');
    mockProductService['getProductById'].mockReturnValue(throwError(() => err));
    component.productId = '10';
    component.isEditMode = true;

    component.loadProductForEdit();

    expect(component.errorMessage).toContain('Error al cargar el producto');
    expect(component.loading).toBe(false);
  });

  it('loadCategories sets errorMessage on failure', () => {
    mockCategoryService['getAllCategories'].mockReturnValue(
      throwError(() => new Error('cat fail'))
    );
    component.loadCategories();
    expect(component.errorMessage).toContain('Error al cargar las categorías');
  });

  it('removeImage clears file & preview', () => {
    component.selectedFile = new File([''], 't.png', { type: 'image/png' });
    component.productForm.patchValue({ imageUrl: 'x' });
    component.removeImage();
    expect(component.selectedFile).toBeNull();
    expect(component.imagePreview).toBeNull();
    expect(component.productForm.value.imageUrl).toBe('');
  });

  it('onCancel navigates to /products', () => {
    const navSpy = jest
      .spyOn(router, 'navigate')
      .mockImplementation(() => Promise.resolve(true) as any);
    component.onCancel();
    expect(navSpy).toHaveBeenCalledWith(['/products']);
  });
});
