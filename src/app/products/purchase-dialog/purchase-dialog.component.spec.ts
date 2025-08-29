import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PurchaseDialogComponent } from './purchase-dialog.component';

describe('PurchaseDialogComponent', () => {
  let fixture: ComponentFixture<PurchaseDialogComponent>;
  let component: PurchaseDialogComponent;

  // MatDialogRef mock (Jest)
  const mockDialogRef = {
    close: jest.fn(),
  } as unknown as MatDialogRef<PurchaseDialogComponent>;

  // Mock product con campos mínimos para que coincida con Product (incluye description y category)
  const mockProduct = {
    id: 1,
    name: 'Test Product',
    description: 'Test description',
    category: { id: '1', name: 'Test Category', description: 'cat desc' },
    price: 10, // si tu interfaz no tiene price no hace daño; TS lo ignora si casteado
  } as unknown;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PurchaseDialogComponent],
      imports: [ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { product: mockProduct } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PurchaseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close with form value on confirm if valid', () => {
    component.purchaseForm.setValue({ quantity: 5 });
    component.onConfirm();
    expect(mockDialogRef.close).toHaveBeenCalledWith({ quantity: 5 });
  });

  it('should NOT close on confirm if form invalid', () => {
    component.purchaseForm.setValue({ quantity: 0 }); // invalid: min(1)
    component.onConfirm();
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  it('should close with false on cancel', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });

  it('totalPrice should return quantity value', () => {
    component.purchaseForm.setValue({ quantity: 7 });
    expect(component.totalPrice).toBe(7);
  });
});
