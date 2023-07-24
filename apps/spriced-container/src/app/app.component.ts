import {   Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from '@spriced-frontend/spriced-ui-lib';
import {  KeycloakAngularModule } from 'keycloak-angular';
import { HeaderComponent } from './core/components/header/header.component';
import { SidebarComponent } from './core/components/sidebar/sidebar.component';
import { BodyComponent } from './core/components/body/body.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { CommonModule } from '@angular/common';


@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, LoaderComponent,KeycloakAngularModule,HeaderComponent,SidebarComponent,BodyComponent,FooterComponent],
  selector: 'sp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],

})

export class AppComponent {
  title = 'Spriced';
  currentAppName: any = 'Spriced';
  path = location.pathname;
  sidebarData = [
    {
      name: 'Data Definition',
      icon: '/assets/images/definition.png',
      path: '/spriced-data-definition',
    },
    {
      name: 'Data Access',
      icon: '/assets/images/access.png',
      path: '/',
    },
    {
      name: 'Data Reporting',
      icon: '/assets/images/reporting.png',
      path: '/spriced-reports',
    },
  ];
  isSideNavCollapsed = false;
  screenWidth = 0;
  menuData?: any[];
  onToggleSideNav(data: any): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
  changeOfRoutes() {
    this.path = location.pathname;
  }
}
