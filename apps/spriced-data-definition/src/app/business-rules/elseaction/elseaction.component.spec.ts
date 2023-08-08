import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElseactionComponent } from './elseaction.component';

describe('ElseactionComponent', () => {
  let component: ElseactionComponent;
  let fixture: ComponentFixture<ElseactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ElseactionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ElseactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
