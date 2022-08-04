import { PLACES } from "../action/Types";


export default function PlaceReducer(state = null, action) {
  switch (action.type) {
    case PLACES:
      return action.data;

    default:
      return state;
  }
}