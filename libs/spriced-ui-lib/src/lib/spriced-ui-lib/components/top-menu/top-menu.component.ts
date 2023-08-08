import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, Input } from "@angular/core";
// import { menuItem } from '@spriced-frontend/shared/data-store';
import { Collapse, initTE } from "tw-elements";
import { RouterModule } from "@angular/router";
import { MenuItem } from "@spriced-frontend/spriced-common-lib";
@Component({
  selector: "sp-top-menu",
  standalone: true,
  templateUrl: "./top-menu.component.html",
  styleUrls: ["./top-menu.component.scss"],
  imports: [CommonModule, RouterModule],
})
export class TopMenuComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    initTE({ Collapse });
  }

  @Input() menuData: MenuItem[] = [];

  showMenu = false;

  show(event: boolean) {
    this.showMenu = event;
  }
  setActive(item: any) {
    this.menuData?.forEach((element: any) => {
      element.active = false;
    });
    item.active = true;
  }
}
