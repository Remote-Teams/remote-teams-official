import { SET_ALL_TICKETS } from "./../types";

const initialState = {
  allTickets: {},
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_ALL_TICKETS:
      return {
        ...state,
        allTickets: action.payload,
      };
    default:
      return state;
  }
}
