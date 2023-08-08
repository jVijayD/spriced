import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { BusinessRuleNameComponent } from './business-rule-name/business-rule-name.component';

export const routes: Route[] = [
  {
    path: 'rule-management',
    component: ListComponent
  },
  {
    path: 'business-rule',
    component: BusinessRuleNameComponent
  },
  {
    path: 'business-rule/:id',
    component: BusinessRuleNameComponent
  },
  {
    path: 'business-rule/:id/:preview',
    component: BusinessRuleNameComponent
  }
];
