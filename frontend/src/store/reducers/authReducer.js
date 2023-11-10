import {
  SET_SIGNUP_USER_INFO,
  SET_LOGIN_FLOW_NEXT,
  GET_PLANS,
  SET_LOGIN,
  SET_COMPANY_DAYS_OFF,
  SET_COMPANY_WORKING_HOURS,
  SET_MEMBER_DAYS_OFF,
  SET_USER_ROLE,
  SET_LOADER,
  CLEAR_LOADER,
  SET_ORGANIZATION_DATA,
  SET_AUTH_API_STATUS,
  SET_WALKTHROUGH_PAGE,
  LOGOUT_USER,
  GET_INVITE_LINK_USERS,
} from "./../types";
import isEmpty from "../validations/is-empty";

const initialState = {
  isAuthenticated: false,
  user: {},
  organizationData: {},
  loginFlowNext: 0,
  plans: {},
  signUpUserInfo: {},
  companyDaysOff: {},
  companyWorkingHours: {},
  memberDaysOff: {},
  allRoles: {},
  loader: false,
  apiStatus: "",
  activeWalkthroughPage: {},
  allUsersInviteLinks: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_LOGIN:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
      };
    case LOGOUT_USER:
      return {
        ...state,
        isAuthenticated: false,
        user: {},
      };
    case SET_SIGNUP_USER_INFO:
      return {
        ...state,
        signUpUserInfo: action.payload,
      };
    case SET_LOGIN_FLOW_NEXT:
      return {
        ...state,
        loginFlowNext: action.payload,
      };
    case GET_PLANS:
      return {
        ...state,
        plans: action.payload,
      };
    case SET_COMPANY_DAYS_OFF:
      return {
        ...state,
        companyDaysOff: action.payload,
      };
    case SET_COMPANY_WORKING_HOURS:
      return {
        ...state,
        companyWorkingHours: action.payload,
      };
    case SET_MEMBER_DAYS_OFF:
      return {
        ...state,
        memberDaysOff: action.payload,
      };

    case SET_USER_ROLE:
      return {
        ...state,
        allRoles: action.payload,
      };
    case SET_LOADER:
      return {
        ...state,
        loader: true,
      };
    case CLEAR_LOADER:
      return {
        ...state,
        loader: false,
      };
    case SET_ORGANIZATION_DATA:
      return {
        ...state,
        organizationData: action.payload,
      };
    case SET_AUTH_API_STATUS:
      return {
        ...state,
        apiStatus: action.payload,
      };
    case SET_WALKTHROUGH_PAGE:
      return {
        ...state,
        activeWalkthroughPage: action.payload,
      };
    case GET_INVITE_LINK_USERS:
      return {
        ...state,
        allUsersInviteLinks: action.payload,
      };
    default:
      return state;
  }
}
