import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppAccessComponent } from './app-access.component';

describe('AppAccessComponent', () => {
  let component: AppAccessComponent;
  let fixture: ComponentFixture<AppAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppAccessComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
