import { Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';



@Injectable()
export class ServiceTokens {
  private _tokens: Map<string, InjectionToken<any>> = new Map();

  constructor() {
    this.init();
  }
  private init(): void {
    //Add all the required Injection Tokens here
    this._tokens.set(
      FORM_DATA_SERVICE,
      new InjectionToken<any>(FORM_DATA_SERVICE)
    );

    //Pipes
    this._tokens.set(PIPE_UPPER_CASE, new InjectionToken<any>(PIPE_UPPER_CASE));

  }

  getToken(name: string) {
    return this._tokens.get(name);
  }
}

export const FORM_DATA_SERVICE = 'FORM_DATA_SERVICE';
export const PIPE_UPPER_CASE = 'PIPE_UPPER_CASE';
