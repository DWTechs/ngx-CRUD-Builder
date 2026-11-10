import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ConfirmService } from "../../../../core/utils/confirm/confirm.service";
import { CrdConfirmComponent } from "./crd-confirm.component";

describe("CrdConfirmComponent", () => {
  let fixture: ComponentFixture<CrdConfirmComponent>;
  let confirmService: ConfirmService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CrdConfirmComponent],
    });
    confirmService = TestBed.inject(ConfirmService);
    confirmService.confirm({
      header: "Confirmation",
      message: "Proceed?",
      accept: vi.fn(),
    });
    fixture = TestBed.createComponent(CrdConfirmComponent);
    fixture.detectChanges();
  });

  it("does not reject when the backdrop is clicked", () => {
    fixture.nativeElement
      .querySelector(".crd-modal-backdrop")
      .dispatchEvent(new MouseEvent("click"));

    expect(confirmService.current()).toBeTruthy();
  });

  it("allows dragging the dialog by its header", () => {
    expect(fixture.nativeElement.querySelector(".cdk-drag")).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector(".cdk-drag-handle"),
    ).toBeTruthy();
  });
});
