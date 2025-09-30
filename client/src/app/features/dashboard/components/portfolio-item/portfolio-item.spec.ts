import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioItem } from './portfolio-item';

describe('PortfolioItem', () => {
  let component: PortfolioItem;
  let fixture: ComponentFixture<PortfolioItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
