import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ToolsModel } from "./tools.model";

const getToolsState=createFeatureSelector<ToolsModel>('tools');

export const getFigure=createSelector(getToolsState,(state)=>{
    return state.figure
});
export const getColor=createSelector(getToolsState,(state)=>{
    return state.color
});
