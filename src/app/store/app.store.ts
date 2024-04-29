import {toolsReducer} from "./tools/tools.reducers";
import {drawedReducer} from "./drawed/drawed.reducers";

export const AppStore={
  tools: toolsReducer,
  drawed: drawedReducer,
}
