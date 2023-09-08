import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EntityService } from "./services/entity.service";
import { ModelService } from "./services/model.service";
import { RequestUtilityService } from "./services/utility/request-utility.service";
import { UserAccessService } from "./services/user-access.service";

@NgModule({
  imports: [CommonModule],
  providers: [
    EntityService,
    UserAccessService,
    ModelService,
    RequestUtilityService,
  ],
})
export class SpricedCommonLibModule {}
