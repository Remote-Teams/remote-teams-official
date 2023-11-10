import { SET_USER_PIPELINE } from "./../types";

const initialState = {
  userPipelines: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER_PIPELINE:
      return {
        ...state,
        userPipelines: action.payload,
      };

    default:
      return state;
  }
}
