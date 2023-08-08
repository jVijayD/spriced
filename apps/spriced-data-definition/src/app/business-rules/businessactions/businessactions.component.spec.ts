import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusinessactionsComponent } from './businessactions.component';

describe('BusinessactionsComponent', () => {
  let component: BusinessactionsComponent;
  let fixture: ComponentFixture<BusinessactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusinessactionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
