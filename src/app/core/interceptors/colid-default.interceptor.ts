import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { GeneralException } from "../../shared/models/exceptions/general-exception";
import { ColidMatSnackBarService } from "../../modules/colid-mat-snack-bar/colid-mat-snack-bar.service";
import { BusinessException } from "../../shared/models/exceptions/business-exception";
import { ValidationException } from "../../shared/models/exceptions/business/validation-exception";
import { EntityValidationException } from "../../shared/models/exceptions/business/validation/entity-validation-exception";
import { ResourceValidationException } from "../../shared/models/exceptions/business/validation/resource-validation-exception";

import { TechnicalException } from "../../shared/models/exceptions/technical-exception";
import { EntityNotFoundException } from "../../shared/models/exceptions/business/entity-not-found-exception";
import { environment } from "src/environments/environment";
import { Constants } from "src/app/shared/constants";

@Injectable()
export class ColidDefaultInterceptor implements HttpInterceptor {
  constructor(
    public router: Router,
    private snackBar: ColidMatSnackBarService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const updateHeaders = { "Cache-Control": "no-cache" };
    if (request.headers.has("x-skip-content-type")) {
      request.headers.delete("x-skip-content-type");
    } else {
      updateHeaders["Content-Type"] = "application/json; charset=utf-8";
    }

    request = request.clone({ setHeaders: updateHeaders });

    return next.handle(request).pipe(
      tap(
        (_) => {},
        (error) => {
          if (error instanceof HttpErrorResponse) {
            // Needed to ignore first user not found exception
            if (this.isToBeIgnoredResponse(error.status, request.url)) {
              return of(error);
            }

            // Needed to handle blocked resources separately
            if (error.status === 423) {
              return of(error);
            }

            if (error.status === 401) {
              this.router.navigate(["unauthorized"]);
              return of(error);
            } else if (error.status === 503) {
              this.router.navigate(["unavailable"]);
            }

            if (error.error as GeneralException) {
              this.handleException(error.error);
              return of(error);
            }
          }
          console.error(error);
          return of(error);
        }
      )
    );
  }

  private isToBeIgnoredResponse(errorStatus: number, url: string) {
    return (
      (errorStatus == 404 &&
        url.startsWith(`${environment.appDataApiUrl}/Users/`)) ||
      (errorStatus == 404 &&
        url.startsWith(`${environment.appDataApiUrl}/activeDirectory/`)) ||
      (errorStatus == 409 &&
        url.startsWith(`${environment.colidApiUrl}/attachment`))
    );
  }

  private handleException(colidException: GeneralException) {
    const statusCode = +colidException.code;
    // Client errors
    if (statusCode >= 400 && statusCode < 500) {
      this.handleClientException(colidException);
    }
    // Server errors
    else if (statusCode >= 500) {
      this.handleServerException(colidException);
    }
  }

  private handleClientException(exception: BusinessException) {
    switch (exception.type) {
      case BusinessException.name:
        this.snackBar.error("Error", exception.message, exception);
        break;
      case ValidationException.name:
        this.handleValidationException(exception as ValidationException);
        break;
      case EntityValidationException.name:
        this.handleValidationException(exception as EntityValidationException);
        break;
      case ResourceValidationException.name:
        // Not reaction needed -> resource form
        break;
      case EntityNotFoundException.name:
        this.snackBar.error("Not found", exception.message, exception);
        break;
      default:
        this.snackBar.error("Error", exception.message, exception);
    }
  }

  private handleValidationException(
    colidException: ValidationException | EntityValidationException
  ) {
    if (
      colidException.validationResult.severity ===
      Constants.Shacl.Severity.Violation
    ) {
      this.snackBar.error("Error", colidException.message, colidException);
    } else if (
      colidException.validationResult.severity ===
      Constants.Shacl.Severity.Warning
    ) {
      this.snackBar.warning(
        "Validation",
        colidException.message,
        colidException
      );
    } else {
      this.snackBar.info("Information", colidException.message, colidException);
    }
  }

  private handleServerException(exception: BusinessException) {
    switch (exception.type) {
      case TechnicalException.name:
        this.snackBar.error("Technical Error", exception.message, exception);
        break;
      default:
        this.snackBar.error("Error", exception.message, exception);
    }
  }
}
