import { SET_ALL_PROJECTS_WORKBOARD } from "./../types";

const initialState = {
  allWorkboard: {},
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_ALL_PROJECTS_WORKBOARD:
      return {
        ...state,
        allWorkboard: action.payload,
      };

    default:
      return state;
  }
}
