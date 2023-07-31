import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ConfirmDialogComponent } from "./confirm-dialog/confirm-dialog.component";
import { InfoDialogComponent } from "./info-dialog/info-dialog.component";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { DialogService } from "./dialog.service";
import { NgxAngularQueryBuilderModule } from "ngx-angular-query-builder";
import { FormsModule } from "@angular/forms";
import { MatRadioModule } from "@angular/material/radio";
import { FilterDialogComponent } from "./filter-dialog/filter-dialog.component";

@NgModule({
  declarations: [
    ConfirmDialogComponent,
    InfoDialogComponent,
    FilterDialogComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    CommonModule,
    NgxAngularQueryBuilderModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
  ],
  providers: [DialogService],
  exports: [ConfirmDialogComponent, InfoDialogComponent, FilterDialogComponent],
})
export class DialogueModule {}
