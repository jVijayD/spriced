import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModelAccessComponent } from './model-access.component';

describe('ModelAccessComponent', () => {
  let component: ModelAccessComponent;
  let fixture: ComponentFixture<ModelAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModelAccessComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModelAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
