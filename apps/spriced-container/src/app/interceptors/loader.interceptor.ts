import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { LoaderService } from "@spriced-frontend/spriced-ui-lib";
import { finalize } from "rxjs";

export function loaderInterceptor(loaderService: LoaderService) {
  return (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    loaderService.show();
    return next(req).pipe(
      finalize(() => {
        loaderService.hide();
      })
    );
  };
}

//OperatorFunction<unknown, HttpEvent<unknown>>
