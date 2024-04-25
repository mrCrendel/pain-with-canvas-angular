import {Component, Input} from '@angular/core';
import {Store} from "@ngrx/store";
import {selectFigure} from "../../store/tools/tools.actions";
import {FigureIndexes} from "../../common/figures";
import {Figure} from "../../store/tools/tools.model";

@Component({
  selector: 'app-figure-button',
  templateUrl: './figure-button.component.html',
  styleUrls: ['./figure-button.component.scss']
})
export class FigureButtonComponent {
  @Input() figure: Figure

  constructor(private store:Store) {
  }

  onSelectFigure() {
    this.store.dispatch(selectFigure({ index: this.figure.index }))
  }
}
