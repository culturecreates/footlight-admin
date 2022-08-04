import {  TYPES } from "../action/Types";


export default function TypesReducer(state = null, action) {
  switch (action.type) {
    case TYPES:
      return action.data;

    default:
      return state;
  }
}