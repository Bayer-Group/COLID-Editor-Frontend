import { TestBed } from "@angular/core/testing";

import { AuthGuardEditorService } from "./auth-guard-editor.service";

describe("AuthGuardEditorService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: AuthGuardEditorService = TestBed.get(AuthGuardEditorService);
    expect(service).toBeTruthy();
  });
});
