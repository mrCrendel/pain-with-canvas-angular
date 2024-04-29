import { createReducer,on } from "@ngrx/store";
import { ToolsState } from "./tools.state";
import {setColor, setFigure} from "./tools.actions";
import {figures, figuresArray} from "../../common/figures";

const _blogReducer = createReducer(ToolsState,
    on(setFigure,(state, action) => {
        return {
            ...state,
            figure: figuresArray.find(figure => figure.index === action.index)
              || figuresArray[0],
        }
    }),
    on(setColor,(state, action) => {
          return {
              ...state,
              color: action.color,
          }
      }),
)

export function toolsReducer(state: any, action: any) {
    return _blogReducer(state, action);

}
