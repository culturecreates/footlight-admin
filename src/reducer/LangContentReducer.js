import { LANGCONTENT } from "../action/Types";


export default function LangContentReducer(state = null, action) {
  switch (action.type) {
    case LANGCONTENT:
      return action.data;

    default:
      return state;
  }
}