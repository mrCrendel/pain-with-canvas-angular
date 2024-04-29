import {Component, Input, OnInit} from '@angular/core';
import {DrawedItem} from "../../store/drawed/drawed.model";
import {Figure} from "../../store/tools/tools.model";
import {figures} from "../../common/figures";
import {removeDrawedItem} from "../../store/drawed/drawed.actions";
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-drawed-card',
  templateUrl: './drawed-card.component.html',
  styleUrls: ['./drawed-card.component.scss']
})
export class DrawedCardComponent implements OnInit{
  @Input() details: DrawedItem
  figure: Figure

  constructor(private store: Store) {
  }
  ngOnInit() {
    this.figure = figures[this.details.index]
  }

  delete() {
    this.store.dispatch(removeDrawedItem({id: this.details.id}))
  }
}
