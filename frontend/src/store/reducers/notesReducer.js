import { SET_ALL_NOTES } from "./../types";

const initialState = {
  allNotes: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_ALL_NOTES:
      return {
        ...state,
        allNotes: action.payload,
      };
    default:
      return state;
  }
}
