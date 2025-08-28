import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { ProductFormDialogComponent, ProductFormDialogData } from './product-form-dialog.component';
import { ProductService } from '../product.service';
import { CategoryService } from '../services/category.service';
import { MaterialModule } from '../../shared/material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ProductFormDialogComponent', () => {
  let component: ProductFormDialogComponent;
  let fixture: ComponentFixture<ProductFormDialogComponent>;
  let mockProductService: Record<string, jest.Mock>;
  let mockCategoryService: Record<string, jest.Mock>;
  let mockDialogRef: Record<string, jest.Mock>;

  beforeEach(async () => {
    mockProductService = {
      createProduct: jest.fn().mockReturnValue(of({})),
      updateProduct: jest.fn().mockReturnValue(of({})),
      createProductWithImage: jest.fn().mockReturnValue(of({})),
      updateProductImage: jest.fn().mockReturnValue(of({})),
    };

    mockCategoryService = {
      getAllCategories: jest.fn().mockReturnValue(of([])),
    };

    mockDialogRef = { close: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MaterialModule, NoopAnimationsModule],
      declarations: [ProductFormDialogComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} as ProductFormDialogData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on init', () => {
    expect(mockCategoryService['getAllCategories']).toHaveBeenCalled();
  });

  it('should handle onCancel', () => {
    component.onCancel();
    expect(mockDialogRef['close']).toHaveBeenCalledWith(false);
  });

  it('should remove image', () => {
    component.selectedFile = new File([], 'test.png');
    component.productForm.patchValue({ imageUrl: 'dummy' });
    component.removeImage();
    expect(component.selectedFile).toBeNull();
    expect(component.imagePreview).toBeNull();
    expect(component.productForm.value.imageUrl).toBe('');
  });

  it('should select valid image file', () => {
    const file = new File([''], 'image.png', { type: 'image/png' });
    const event = { target: { files: [file] } } as unknown as Event;
    component.onFileSelected(event);
    expect(component.selectedFile).toBe(file);
    expect(component.errorMessage).toBe('');
  });

  it('should reject invalid image file type', () => {
    const file = new File([''], 'file.txt', { type: 'text/plain' });
    const event = { target: { files: [file] } } as unknown as Event;
    component.onFileSelected(event);
    expect(component.selectedFile).toBeNull();
    expect(component.errorMessage).toBe('Solo se permiten archivos de imagen.');
  });

  it('should reject large image file', () => {
    const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], 'large.png', {
      type: 'image/png',
    });
    const event = { target: { files: [largeFile] } } as unknown as Event;
    component.onFileSelected(event);
    expect(component.selectedFile).toBeNull();
    expect(component.errorMessage).toBe('La imagen no puede superar los 5MB.');
  });

  it('should submit create product without image', () => {
    component.productForm.patchValue({
      name: 'Test',
      description: 'Desc',
      categoryId: 1,
    });
    component.onSubmit();
    expect(mockProductService['createProduct']).toHaveBeenCalled();
  });

  it('should submit update product in edit mode without image', () => {
    component.isEditMode = true;
    component.data.product = {
      id: 1,
      name: 'A',
      description: 'B',
      imageUrl: '',
      category: { id: 1, name: 'Cat' },
    } as any;
    component.productForm.patchValue({
      name: 'Test',
      description: 'Desc',
      categoryId: 1,
    });
    component.onSubmit();
    expect(mockProductService['updateProduct']).toHaveBeenCalled();
  });

  it('should handle error loading categories', () => {
    mockCategoryService['getAllCategories'].mockReturnValueOnce(
      throwError(() => new Error('fail'))
    );
    component.loadCategories();
    expect(component.errorMessage).toContain('fail');
  });

  it('should load product for edit', () => {
    component.data.product = {
      id: 1,
      name: 'A',
      description: 'B',
      imageUrl: 'img.png',
      category: { id: 1, name: 'Cat' },
    } as any;
    component.loadProductForEdit();
    expect(component.productForm.value.name).toBe('A');
    expect(component.imagePreview).toBe('img.png');
  });
});
