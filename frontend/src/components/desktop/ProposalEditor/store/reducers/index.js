import { combineReducers } from "redux";
import proposalReducer from "./proposalReducer";
import prposalDataReducer from './proposalDataReducer';

export default combineReducers({
    createProposal:proposalReducer,
    proposalData:prposalDataReducer
})