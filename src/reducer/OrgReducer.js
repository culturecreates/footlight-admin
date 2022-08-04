import { ORG } from "../action/Types";


export default function OrgReducer(state = null, action) {
  switch (action.type) {
    case ORG:
      return action.data;

    default:
      return state;
  }
}