import { Route } from "@angular/router";
import { EntityDataComponent } from "../pages/entity-data/entity-data.component";
import { AppComponent } from "../app.component";
import { ModelListComponent } from "../pages/model-list/model-list.component";
import { UploadErrorComponent } from "../pages/upload-error/upload-error.component";
import { NotificationsComponent } from "../pages/notifications/notifications.component";
import { WebsocketComponent } from "../pages/websocket/websocket.component";

export const remoteRoutes: Route[] = [
  {
    path: "",
    component: AppComponent,
    children: [
      { path: "", component: EntityDataComponent },
      { path: "model-view", component: ModelListComponent },
      { path: ":modelId/:entityId", component: EntityDataComponent },
      { path: "lookup/:id", component: EntityDataComponent },
      {
        path: "upload-error/:modelId/:entityId",
        component: UploadErrorComponent,
      },
      { path: "notification", component: NotificationsComponent },
      { path: "websocket", component: WebsocketComponent },
    ],
  },
];
