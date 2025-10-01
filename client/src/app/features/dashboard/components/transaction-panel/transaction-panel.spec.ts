import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionPanel } from './transaction-panel';

describe('TransactionPanel', () => {
  let component: TransactionPanel;
  let fixture: ComponentFixture<TransactionPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
