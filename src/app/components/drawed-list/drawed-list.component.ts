import {Component, OnInit} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {selectDrawedList} from "../../store/drawed/drawed.selectors";
import {DrawedItem} from "../../store/drawed/drawed.model";

@Component({
  selector: 'app-drawed-list',
  templateUrl: './drawed-list.component.html',
  styleUrls: ['./drawed-list.component.scss']
})
export class DrawedListComponent implements OnInit{
  public drawedList: DrawedItem[]
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.select(selectDrawedList).subscribe(drawedList => {
      this.drawedList = drawedList;
    });
  }
}
