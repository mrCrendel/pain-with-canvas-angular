import { createAction, props } from "@ngrx/store";
import {DrawedItem} from "./drawed.model";

export const ADD_DRAWED_ITEM='ADD_DRAWED_ITEM';
export const REMOVE_DRAWED_ITEM='REMOVE_DRAWED_ITEM';


export const addDrawedItem=createAction(ADD_DRAWED_ITEM,props<{ item: DrawedItem }>());
export const removeDrawedItem=createAction(REMOVE_DRAWED_ITEM,props<{ id: string }>());

