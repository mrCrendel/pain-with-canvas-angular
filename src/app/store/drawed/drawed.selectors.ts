import { createFeatureSelector, createSelector } from "@ngrx/store";
import { DrawedModel } from "./drawed.model";

const getDrawedListState=createFeatureSelector<DrawedModel>('drawed');

export const selectDrawedList=createSelector(getDrawedListState,(state)=>{
    return state.figures
});
export const selectDrawedRerender=createSelector(getDrawedListState,(state)=>{
    return state.redraw
});
