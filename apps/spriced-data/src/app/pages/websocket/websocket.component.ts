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
  url: string =
    "ws://localhost:9001/api/v1/data-api/socket/entity/264/data?access_token=eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJDYTZ5YnhvRWhLZ09haHE2U1lWWWxPdFJhSWdRaVYxSFplcmFwOWxBcHNFIn0.eyJleHAiOjE3MTUzNDExMjIsImlhdCI6MTcxNTMwODUwNywiYXV0aF90aW1lIjoxNzE1MjU0NzIyLCJqdGkiOiIxYzQ2Y2IwNy0wYTJhLTQ1YjYtOWM4ZC04NDQzN2ZlNDYzOTUiLCJpc3MiOiJodHRwczovL2F1dGguZGV2LnNpbWFkdmlzb3J5LmNvbS9hdXRoL3JlYWxtcy9EX1NQUklDRUQiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiYzk5M2MwNDktMDUzYS00YzAwLTgzYjktNjE4ZGYzMjk1ZTdkIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiRF9TUFJJQ0VEX0NsaWVudCIsIm5vbmNlIjoiZjc2MTVlMGEtMjYxOC00YjYzLTg4ODAtYzE2OGNmNzA0NWE1Iiwic2Vzc2lvbl9zdGF0ZSI6IjRjNTEwYWRhLWRhNWUtNGM0Ny04OWQ1LTZkZGUyYmViOWQ2ZiIsImFjciI6IjAiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cHM6Ly9zcHJpY2VkLmRldi5zaW1hZHZpc29yeS5jb20iLCJodHRwOi8vbG9jYWxob3N0OjQyMDIiLCJodHRwczovL2xvY2FsaG9zdDozMDAwIiwiaHR0cHM6Ly80NjMzLTEyMi0xNjUtMTY5LTIzNS5uZ3Jvay1mcmVlLmFwcCIsImh0dHBzOi8vc3ByaWNlZC5kZXYubWVyaXRvci5zaW1hZHZpc29yeS5jb20iLCJodHRwczovL3JlcG9ydHMuc3ByaWNlZC5kZXYuc2ltYWR2aXNvcnkuY29tIiwiKiIsImh0dHBzOi8vc3ByaWNlZC5tZXJpdG9yLnVhdC5zaW1hZHZpc29yeS5jb20iLCJodHRwczovL3d3dy5zaW1hZHZpc29yeS5jb206NDIwMCIsImh0dHA6Ly9sb2NhbGhvc3Q6NDIwMCIsImh0dHBzOi8vc3ByaWNlZC50ZXN0LnNpbWFkdmlzb3J5LmNvbSIsImh0dHBzOi8vcGRtLnNpbWFkdmlzb3J5LmNvbSJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1kX3NwcmljZWQiLCJBZG1pbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIHJvbGVzIHByb2ZpbGUgZW1haWwiLCJzaWQiOiI0YzUxMGFkYS1kYTVlLTRjNDctODlkNS02ZGRlMmJlYjlkNmYiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6InRpbnUgdGludSIsInByZWZlcnJlZF91c2VybmFtZSI6InRpbnUiLCJnaXZlbl9uYW1lIjoidGludSIsImZhbWlseV9uYW1lIjoidGludSIsInRlbmFudCI6Im1lcml0b3IiLCJlbWFpbCI6InRpbnUuemFjaGFyaWFzQHNpbWFkdmlzb3J5cGFydG5lci5jb20ifQ.hi0DrFODi9XrCUj1CUDwvZskuS_CTjC6F05-KMKbJbPCazLml6x3__CsRRBONs-wQrhZZLIf2-YSX1lUqH1vYaIwLbn2paL4Can-FwlkWm92uXfjl9GYkykpuRB_6ifu98xxlRgcss-Lchvn0GIC--muCw9SiTrd_fHhUHKJdgi0L_vwn9NINMAVX6-uvb5rKKxE9cMvx3lU62OnLmb_qkwmGWVM-o9PoM3S130TTEtudir-AmTrQ_eZWl8gokJ7qtJUsReNyVhwUX653JK9Ulj8QHSS6mlO8ZqP-mPNdsasTtinkOmCGwea-kdBfPAlfoNYyA-xcMXL5OcCo-zZ-g";

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
        "/socket/entity/264/data?access_token=" +
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
