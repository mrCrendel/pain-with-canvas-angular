import { createReducer,on } from "@ngrx/store";
import { DrawedState } from "./drawed.state";
import {addDrawedItem, removeDrawedItem} from "./drawed.actions";

const _blogReducer = createReducer(DrawedState,
    on(addDrawedItem,(state, action) => {
      console.log("--------- addDrawedItem => ", action.item)
        return {
            ...state,
            figures: [...state.figures, action.item]
        }
    }),
    on(removeDrawedItem,(state,action) => {
      console.log("--------- addDrawedItem => ", action.id)

      const remain = state.figures.filter(item => item.id !== action.id)
      console.log(remain.length, remain)

      return {
        ...state,
        figures: remain,
        redraw: remain
      }
    }),
)

export function drawedReducer(state: any, action: any) {
    return _blogReducer(state, action);

}
