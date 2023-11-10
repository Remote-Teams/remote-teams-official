import { combineReducers } from "redux";
import authReducer from './authReducer';
import emailReducer from "./emailReducer";
import contactReducer from './contactReducer';
import eventReducer from "./eventReducer";

export default combineReducers({
    auth:authReducer,
    email:emailReducer,
    contact:contactReducer,
    events:eventReducer
});