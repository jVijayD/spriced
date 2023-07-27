import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class headerInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const authReq = req.clone({
            headers: new HttpHeaders({
                "tenant": "meritor",
                "user": "anand.kumar@simadvisory.com",
                "transactionId": "AQWSIDSTWERTXWSATYYOKLMH",
                "roles": "admin,manager,viewer",
                "applications": "app1,app2,app3",
                "Access-Control-Allow-Origin": "*"
            })
        })

        console.log('Intercepted HTTP call', authReq);

        return next.handle(authReq);
    }
}