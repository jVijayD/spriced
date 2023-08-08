import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StyleUtilityService } from "./services/style-utility.service";
import { EntityService } from "./services/entity.service";
import { ModelService } from "./services/model.service";
import { RequestUtilityService } from "./services/utility/request-utility.service";

@NgModule({
  imports: [CommonModule],
  providers: [
    StyleUtilityService,
    EntityService,
    ModelService,
    RequestUtilityService,
  ],
})
export class SpricedCommonLibModule {}
