import { createAction, props } from "@ngrx/store";
import {FigureIndexes} from "../../common/figures";

export const SELECT_FIGURE='SELECT_FIGURE';
export const SELECT_COLOR='SELECT_COLOR';


export const selectFigure=createAction(SELECT_FIGURE,props<{ index: FigureIndexes }>());
export const selectColor=createAction(SELECT_COLOR,props<{ color: string }>());

