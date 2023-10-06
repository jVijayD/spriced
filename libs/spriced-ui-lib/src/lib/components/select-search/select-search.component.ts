import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { MatOption } from '@angular/material/core';
@Component({
  selector: 'sp-select-search',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule, NgxMatSelectSearchModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  templateUrl: './select-search.component.html',
  styleUrls: ['./select-search.component.css']
})
export class SelectSearchComponent {

  @Input() appearance: 'fill' | 'outline' = 'outline';
  @Input() placeholder?: string;
  @Input() items: any[] = [];
  @Input() model!: any;
  @Input() bindValueKey!: string;
  @Input() sorters: sorter[] = [];
  @Input() bindLabelKey: string = "label";
  @Output() selectionChange: EventEmitter<any> = new EventEmitter<any>();
  currentStaticItems: Array<any> = this.items;
  sortFunc: (a: any, b: any) => number =
    (a, b) => {
      if (this.sorters && this.sorters.length) {
        let diff = 0
        let i = 1;
        this.sorters.forEach((srt) => {
          // diff += srt.direction == Direction.ASC ?
          diff += a[srt.property] == b[srt.property] ? 0 :
            srt?.direction == Direction.DESC ?
              (b[srt.property] < a[srt.property] ? -1 : 1) :
              (a[srt.property] < b[srt.property] ? -1 : 1)
        })
        return diff;
      }
      return 1;
    };

  sortList() {
    this.currentStaticItems = (!this.currentStaticItems || !this.currentStaticItems.length) ? this.items : this.currentStaticItems;
    this.currentStaticItems = this.currentStaticItems?.sort(this.sortFunc);

  }
  onFilterChange(v: any) {
    this.items = (!v || !v.length) ?
      this.currentStaticItems :
      this.currentStaticItems.filter(i => i[this.bindLabelKey].toLowerCase().search(v.toLowerCase()) >= 0)
  }
}
export enum Direction { ASC = "ASC", DESC = "DESC" };
export interface sorter {
  property: string;
  direction?: Direction;
}
