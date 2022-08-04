import { FILTER } from "../action/Types";

const initialVal={
  data: null,
  selectedValue: null
}
export default function FilterReducer(state = initialVal, action) {
  switch (action.type) {
    case FILTER:
      return action.data;

    default:
      return state;
  }
}
