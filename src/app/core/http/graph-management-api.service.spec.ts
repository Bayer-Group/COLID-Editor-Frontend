import { TestBed } from "@angular/core/testing";

import { GraphManagementApiService } from "./graph-management-api.service";

describe("GraphManagementApiService", () => {
  let service: GraphManagementApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphManagementApiService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
