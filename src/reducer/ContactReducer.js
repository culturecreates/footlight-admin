import { CONTACTS } from "../action/Types";


export default function ContactReducer(state = null, action) {
  switch (action.type) {
    case CONTACTS:
      return action.data;

    default:
      return state;
  }
}