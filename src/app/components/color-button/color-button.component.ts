import {Component, Input, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {selectColor, selectFigure} from "../../store/tools/tools.actions";

@Component({
  selector: 'app-color-button',
  templateUrl: './color-button.component.html',
  styleUrls: ['./color-button.component.scss']
})
export class ColorButtonComponent {
  @Input() color: string

  constructor(private store:Store) {
  }

  onSelectColor() {
    this.store.dispatch(selectColor({ color: this.color }))
  }
}
