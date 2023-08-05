import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusDialogueComponent } from './status-dialogue.component';


describe('ErrordialogueComponent', () => {
  let component: StatusDialogueComponent;
  let fixture: ComponentFixture<StatusDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusDialogueComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
