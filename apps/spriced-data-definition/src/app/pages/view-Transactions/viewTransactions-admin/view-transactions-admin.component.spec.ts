import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ViewTransactionsAdminComponent } from "./view-transactions-admin.component";

describe("ViewTransactionsAdminComponent", () => {
  let component: ViewTransactionsAdminComponent;
  let fixture: ComponentFixture<ViewTransactionsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTransactionsAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewTransactionsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
