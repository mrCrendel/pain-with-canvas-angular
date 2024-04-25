import {DrawFunction, FigureIndexes} from "../../common/figures";

export interface Figure {
    path:string,
    title:string,
    index: FigureIndexes,
    draw: DrawFunction
}

export interface ToolsModel {
  figure: Figure
  color: string
}
