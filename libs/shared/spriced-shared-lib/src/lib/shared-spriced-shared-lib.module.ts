import { APP_INITIALIZER, NgModule, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { initializeKeycloak } from "./auth/keycloak-init.factory";
import { KeycloakAngularModule, KeycloakService } from "keycloak-angular";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { headerInterceptor } from "./auth/header-interceptor";

import { DBConfig, NgxIndexedDBModule } from "ngx-indexed-db";
const dbConfig: DBConfig = {
  name: "settings",
  version: 3,
  objectStoresMeta: [
    {
      store: "this_entity",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "entity", keypath: "entity", options: { unique: false } },
        {
          name: "noOfRecords",
          keypath: "noOfRecords",
          options: { unique: false },
        },
        {
          name: "freeze",
          keypath: "freeze",
          options: { unique: false },
        },
      ],
    },

    {
      store: "all_entity",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        {
          name: "displayFormat",
          keypath: "displayFormat",
          options: { unique: false },
        },
        {
          name: "showSystem",
          keypath: "showSystem",
          options: { unique: false },
        },
      ],
    },
  ],
};

@NgModule({
  imports: [
    CommonModule,
    KeycloakAngularModule,
    HttpClientModule,
    NgxIndexedDBModule.forRoot(dbConfig),
  ],
  providers: [
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: headerInterceptor,
    //   multi: true,
    // },
  ],
})
export class SharedSpricedSharedLibModule {}
