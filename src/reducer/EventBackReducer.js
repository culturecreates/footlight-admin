import {  EVENTBACK } from "../action/Types";


export default function EventBackReducer(state = null, action) {
  switch (action.type) {
    case EVENTBACK:
      return action.data;

    default:
      return state;
  }
}