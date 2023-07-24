import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Inject } from "@angular/core";
import { LoaderService } from "@spriced-frontend/spriced-ui-lib";
import { Observable, finalize } from "rxjs";

export function loaderInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const loderService = Inject(LoaderService);
  console.log("Loader Interceptor");
  loderService.show();
  return next(req).pipe(
    finalize(() => {
      loderService.hide();
    })
  );
}

//OperatorFunction<unknown, HttpEvent<unknown>>
