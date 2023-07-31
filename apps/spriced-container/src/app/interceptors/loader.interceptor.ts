import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { LoaderService } from "@spriced-frontend/spriced-ui-lib";
import { finalize } from "rxjs";

export function loaderInterceptor(loaderService: LoaderService) {
  return (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    if (req.headers.get("no-loader") == "true") return next(req);
    else {
      loaderService.show();
      return next(req).pipe(
        finalize(() => {
          loaderService.hide();
        })
      );
    }
  };
}
