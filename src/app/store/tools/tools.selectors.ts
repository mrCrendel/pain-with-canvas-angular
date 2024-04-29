import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ToolsModel } from "./tools.model";

const getToolsState=createFeatureSelector<ToolsModel>('tools');

export const selectFigure=createSelector(getToolsState,(state)=>{
    return state.figure
});
export const selectColor=createSelector(getToolsState,(state)=>{
    return state.color
});
