import { TestBed } from "@angular/core/testing";

import { WelcomeMessageApiService } from "./welcome.message.api.service";

describe("WelcomeMessage.ApiService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: WelcomeMessageApiService = TestBed.get(
      WelcomeMessageApiService
    );
    expect(service).toBeTruthy();
  });
});
