import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StyleUtilityService } from './services/style-utility.service';

@NgModule({
  imports: [CommonModule],
  providers: [StyleUtilityService],
})
export class SpricedCommonLibModule {}
