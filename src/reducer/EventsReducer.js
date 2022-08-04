import {  EVENTLIST } from "../action/Types";


export default function EventsReducer(state = null, action) {
  switch (action.type) {
    case EVENTLIST:
      return action.data;

    default:
      return state;
  }
}