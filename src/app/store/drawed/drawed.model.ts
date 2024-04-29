import {FigureIndexes} from "../../common/figures";
import {Coordinates} from "../../components/canvas/canvas.component";

export interface DrawedItem {
  id: string
  index: FigureIndexes
  position: Coordinates,
  dragStartLocation: Coordinates
}

export interface DrawedModel {
  figures: DrawedItem[]
  redraw: DrawedItem[]
}
