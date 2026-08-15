import { TestBed } from "@angular/core/testing";
import { ConfirmService } from "../../../core/utils/confirm/confirm.service";
import { TableConfirmActionsService } from "./table-confirm-actions.service";

describe("TableConfirmActionsService", () => {
  let service: TableConfirmActionsService;
  let confirmService: ConfirmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableConfirmActionsService);
    confirmService = TestBed.inject(ConfirmService);
  });

  describe("confirmArchive", () => {
    it("should use the singular message for a single entry", () => {
      const onAccept = vi.fn();

      service.confirmArchive(1, onAccept);

      expect(confirmService.current()?.message).toBe(
        "Etes-vous sûr de vouloir archiver cet élément ?",
      );
    });

    it("should use the plural message with the count for multiple entries", () => {
      const onAccept = vi.fn();

      service.confirmArchive(3, onAccept);

      expect(confirmService.current()?.message).toContain("3");
    });

    it("should call onAccept when the confirmation is accepted", () => {
      const onAccept = vi.fn();

      service.confirmArchive(1, onAccept);
      confirmService.accept();

      expect(onAccept).toHaveBeenCalled();
    });
  });

  describe("confirmRestore", () => {
    it("should use the singular restore message for a single entry", () => {
      const onAccept = vi.fn();

      service.confirmRestore(1, onAccept);

      expect(confirmService.current()?.message).toBe(
        "Etes-vous sûr de vouloir restaurer cet élément ?",
      );
    });

    it("should call onAccept when the confirmation is accepted", () => {
      const onAccept = vi.fn();

      service.confirmRestore(2, onAccept);
      confirmService.accept();

      expect(onAccept).toHaveBeenCalled();
    });
  });
});
