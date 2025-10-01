import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTransactionModal } from './transaction-modal';

describe('NewTransactionModal', () => {
  let component: NewTransactionModal;
  let fixture: ComponentFixture<NewTransactionModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewTransactionModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewTransactionModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
