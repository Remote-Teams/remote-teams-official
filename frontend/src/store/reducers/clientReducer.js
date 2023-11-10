import {
  SET_ALL_CLIENTS,
  SET_CLIENT_OVERVIEW,
  SET_API_STATUS,
  SET_CLIENT_COUNT,
  SET_TOTAL_CLIENT_THIS_MONTH,
} from "./../types";

const initialState = {
  allClients: {},
  clientOverview: {},
  apiStatus: {},
  allClientCount: {},
  totalClientCountThisMonth: {},
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_ALL_CLIENTS:
      return {
        ...state,
        allClients: action.payload,
      };
    case SET_CLIENT_OVERVIEW:
      return {
        ...state,
        clientOverview: action.payload,
      };
    case SET_API_STATUS:
      return {
        ...state,
        apiStatus: action.payload,
      };
    case SET_CLIENT_COUNT:
      return {
        ...state,
        allClientCount: action.payload,
      };
    case SET_TOTAL_CLIENT_THIS_MONTH:
      return {
        ...state,
        totalClientCountThisMonth: action.payload,
      };
    default:
      return state;
  }
}
