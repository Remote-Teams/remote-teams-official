import { SET_AUTH_LOADER, SET_ACTIVE_ACCOUNTS, SET_NOTACTIVE_ACCOUNTS } from "../types";

const initialState = {
    auth_loader : false,
    active_accounts:[],
    inactive_accounts:[],
}

export default function( state = initialState, action ){
    switch( action.type ){
        case SET_AUTH_LOADER:
            return {
                ...state,
                auth_loader : action.payload
            }
        case SET_ACTIVE_ACCOUNTS:
            return {
                ...state,
                active_accounts : action.payload,
            }
        case SET_NOTACTIVE_ACCOUNTS:
            return {
                ...state,
                inactive_accounts : action.payload
            }
        default:
            return state
    }
}