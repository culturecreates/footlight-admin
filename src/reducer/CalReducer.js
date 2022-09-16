import { CAL } from "../action/Types";


export default function CalReducer(state = null, action) {
  switch (action.type) {
    case CAL:
      return action.data;

    default:
      return state;
  }
}