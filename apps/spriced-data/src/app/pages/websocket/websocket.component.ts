import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  AppForm,
  DataGridComponent,
  DialogueModule,
  DynamicFormModule,
  DynamicFormService,
  DialogService,
  SnackBarService,
  SnackbarModule,
  FORM_DATA_SERVICE,
  FormFieldControls,
  Header,
  HeaderActionComponent,
  Paginate,
  TwoColThreeForthComponent,
  HeaderComponentWrapperComponent,
  GridConstants,
} from "@spriced-frontend/spriced-ui-lib";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ColumnMode, SelectionType, SortType } from "@swimlane/ngx-datatable";
import { EntitySelectComponent } from "../../components/entity-select/entity-select.component";
import { AddModelComponent } from "../entity-data/add-model/add-model.component";
import { MatDialog } from "@angular/material/dialog";
import { UploadDialogeComponent } from "../../components/upload-dialoge/upload-dialoge.component";
import { SettingsPopUpComponent } from "../../components/settingsPopUp/settings-pop-up.component";
import { StatusComponent } from "../../components/status/status.component";
import {
  MatExpansionModule,
  MatExpansionPanel,
} from "@angular/material/expansion";
import {
  Attribute,
  Criteria,
  Entity,
  EntityService,
} from "@spriced-frontend/spriced-common-lib";
import { Validators } from "@angular/forms";
import { EntityDataStagingService } from "../../services/entity-data-staging.service";
import { Observable, Subscription } from "rxjs";
import * as moment from "moment";
import { SettingsService } from "../../components/settingsPopUp/service/settings.service";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";

import { AuditDataComponent } from "@spriced-frontend/spriced-ui-lib";
import { LookupPopupComponent } from "../../components/lookup-Popup/lookup-popup.component";
import { EntityGridService } from "../entity-data/entity-grid.service";
import { EntityFormService } from "../entity-data/entity-form.service";
import {
  AppDataService,
  ErrorTypes,
} from "@spriced-frontend/shared/spriced-shared-lib";
import { ToolTipRendererDirective } from "libs/spriced-ui-lib/src/lib/components/directive/tool-tip-renderer.directive";
import { CustomToolTipComponent } from "libs/spriced-ui-lib/src/lib/components/custom-tool-tip/custom-tool-tip.component";
import { WebsocketUtilityService } from "libs/spriced-common-lib/src/lib/services/utility/websocket-utility.service";
import { WebSocketSubject } from "rxjs/webSocket";
import { KeycloakService } from "keycloak-angular";

@Component({
  selector: "sp-websocket",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [CommonModule],
  providers: [WebsocketUtilityService],
  templateUrl: "./websocket.component.html",
  styleUrls: ["./websocket.component.scss"],
})
export class WebsocketComponent implements OnInit, OnDestroy {
  private _webSocketSubject: WebSocketSubject<any> | undefined;
  private _messagesSubscription: Subscription | undefined;
  constructor(
    private websocketService: WebsocketUtilityService,
    private keycloak: KeycloakService
  ) {}
  ngOnDestroy(): void {
    this._messagesSubscription?.unsubscribe();
  }
  ngOnInit(): void {
    this._webSocketSubject = this.websocketService.connect(
      (process.env["NX_WS_API_DATA_URL"] as string) +
        "/socket/entity/98/data?access_token=" +
        this.keycloak.getKeycloakInstance().idToken
    );
    this._messagesSubscription = this._webSocketSubject.subscribe({
      next: (response) => console.log(response),
      error: (err) => console.log(err),
      complete: () => console.log("completed."),
    });
    this.websocketService.sendMessage(this._webSocketSubject, {
      pageSize: 100,
      maxPageNumber: 10,
      sorters: [
        {
          direction: "DESC",
          property: "id",
        },
      ],
    });
  }
}
