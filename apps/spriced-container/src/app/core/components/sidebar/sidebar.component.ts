import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  Component,
  Output,
  Input,
  EventEmitter,
  OnInit,
  HostListener,
} from '@angular/core';
import { RouterModule } from '@angular/router';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}
import {MatDividerModule} from '@angular/material/divider';
@Component({
  selector: 'sp-sidebar',
  standalone:true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [
    CommonModule,
  RouterModule,MatDividerModule
  ],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('350ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('350ms ease-out', style({ opacity: 0 })),
      ]),
    ]),
    trigger('rotate', [
      transition(':enter', [
        animate(
          '350ms ease-out',
          keyframes([
            style({ transform: 'rotate(.5turn)', offset: '0' }),
            style({ transform: 'rotate(0deg)', offset: '1' }),
          ])
        ),
      ]),
    ]),
  ],
})
export class SidebarComponent implements OnInit {
  @Output() ToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  @Input()
  data: any;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.ToggleSideNav.emit({
        collapsed: this.collapsed,
        screenWidth: this.screenWidth,
      });
    }
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
  }
  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.ToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.ToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }
}

// import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
// import { Sidenav } from 'tw-elements';

// @Component({
//   selector: 'sp-sidebar',
//   templateUrl: './sidebar.component.html',
//   styleUrls: ['./sidebar.component.css'],
// })
// export class SidebarComponent implements OnInit, AfterViewInit {
//   @Input() data: any;

//   ngAfterViewInit() {
//     const sidenav2 = document.getElementById('sidenav-1');
//     const sidenavInstance2 = Sidenav.getInstance(sidenav2);

//     // let innerWidth2: number | null = null;

//   //   const setMode2 = (e: any) => {
//   //     // Check necessary for Android devices
//   //     if (window.innerWidth === innerWidth2) {
//   //       return;
//   //     }

//   //     innerWidth2 = window.innerWidth;

//   //     if (window.innerWidth < sidenavInstance2.getBreakpoint('xl')) {
//   //       sidenavInstance2.changeMode('over');
//   //       sidenavInstance2.hide();
//   //     } else {
//   //       sidenavInstance2.changeMode('side');
//   //       sidenavInstance2.show();
//   //     }
//   //   };

//   //   if (window.innerWidth < sidenavInstance2.getBreakpoint('sm')) {
//   //     setMode2('');
//   //   }

//   //   // Event listeners
//   //   window.addEventListener('resize', setMode2);
//   }
//   ngOnInit(): void {
//     // this.service.getNavMenu().subscribe((results) => {
//     console.log(this.data);
//     // });
//   }
// }
