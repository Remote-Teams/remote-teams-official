import {
  SET_ALL_USERS_ROLES,
  SET_ALL_CUSTOM_FIELDS,
  GET_FIELDS_VALUE_BY_ENTITY,
  SET_CLIENT_ALL_CUSTOME_FIELDS,
  SET_MEMBER_ALL_CUSTOME_FIELDS,
  SET_PROJECT_ALL_CUSTOME_FIELDS,
} from "./../types";
import isEmpty from "./../validations/is-empty";

const initialState = {
  memberAllRoles: [],
  allCustomFields: [],
  allFieldsValue: [],
  clientCustomFields: [],
  memberCustomFields: [],
  projectCustomFields: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_ALL_USERS_ROLES:
      return {
        ...state,
        memberAllRoles: action.payload,
      };
    case SET_ALL_CUSTOM_FIELDS:
      return {
        ...state,
        allCustomFields: action.payload,
      };

    case GET_FIELDS_VALUE_BY_ENTITY:
      return {
        ...state,
        allFieldsValue: action.payload,
      };
    case SET_CLIENT_ALL_CUSTOME_FIELDS:
      return {
        ...state,
        clientCustomFields: action.payload,
      };
    case SET_MEMBER_ALL_CUSTOME_FIELDS:
      return {
        ...state,
        memberCustomFields: action.payload,
      };
    case SET_PROJECT_ALL_CUSTOME_FIELDS:
      return {
        ...state,
        projectCustomFields: action.payload,
      };

    default:
      return state;
  }
}
