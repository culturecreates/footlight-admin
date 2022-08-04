import { AUDIENCE } from "../action/Types";


export default function AudienceReducer(state = null, action) {
  switch (action.type) {
    case AUDIENCE:
      return action.data;

    default:
      return state;
  }
}