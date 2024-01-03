import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ConfirmDialogComponent } from "./confirm-dialog/confirm-dialog.component";
import { InfoDialogComponent } from "./info-dialog/info-dialog.component";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { DialogService } from "./dialog.service";
import { NgxAngularQueryBuilderModule } from "ngx-angular-query-builder";
import { FormsModule } from "@angular/forms";
import { MatRadioModule } from "@angular/material/radio";
import { FilterDialogComponent } from "./filter-dialog/filter-dialog.component";
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";

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
    MatSelectModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    MatInputModule,
    MatMenuModule
  ],
  providers: [DialogService],
  exports: [ConfirmDialogComponent, InfoDialogComponent, FilterDialogComponent],
})
export class DialogueModule {}
