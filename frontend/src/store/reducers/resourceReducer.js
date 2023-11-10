import {
  SET_ALL_RESOURCES,
  SET_MEMBER_COUNT,
  SET_RESOURCE_OVERVIEW,
  SET_SINGLE_RSOURCE_DATA,
} from "./../types";
import isEmpty from "../validations/is-empty";

const initialState = {
  allResources: {},
  allResourceCount: {},
  resourceOverview: {},
  singleResourceData: {},
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_ALL_RESOURCES:
      return {
        ...state,
        allResources: action.payload,
      };
    case SET_MEMBER_COUNT:
      return {
        ...state,
        allResourceCount: action.payload,
      };
    case SET_RESOURCE_OVERVIEW:
      return {
        ...state,
        resourceOverview: action.payload,
      };
    case SET_SINGLE_RSOURCE_DATA:
      return {
        ...state,
        singleResourceData: action.payload,
      };
    default:
      return state;
  }
}
