import { LANG } from "../action/Types";


export default function LangReducer(state = null, action) {
  switch (action.type) {
    case LANG:
      return action.data;

    default:
      return state;
  }
}