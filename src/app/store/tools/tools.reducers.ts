import { createReducer,on } from "@ngrx/store";
import { ToolsState } from "./tools.state";
import {selectColor, selectFigure} from "./tools.actions";
import {figures} from "../../common/figures";

const _blogReducer = createReducer(ToolsState,
    on(selectFigure,(state,action)=>{
        return{
            ...state,
            figure: figures.find(figure => figure.index === action.index) || figures[0],
        }
    }),
  on(selectColor,(state,action)=>{
        return{
            ...state,
            color: action.color,
        }
    }),
)

export function toolsReducer(state: any, action: any) {
    return _blogReducer(state, action);

}
