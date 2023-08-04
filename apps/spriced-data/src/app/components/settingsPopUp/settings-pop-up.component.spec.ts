import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsPopUpComponent } from './settings-pop-up.component';

describe('SettingsPopUpComponent', () => {
  let component: SettingsPopUpComponent;
  let fixture: ComponentFixture<SettingsPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsPopUpComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
