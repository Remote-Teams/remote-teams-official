import { SET_EMAIL_LOADER, GET_ALL_DRAFTS, GET_EMAIL_THREADS } from '../types';

const initialState = {
    email_loader:false,
    all_threds:{},
    all_drafts:{}
}

export default function ( state = initialState, action ){
    switch( action.type ){
        case SET_EMAIL_LOADER:
            return {
                ...state,
                auth_loader : action.payload
            }
        case GET_ALL_DRAFTS:
            return {
                ...state,
                all_drafts:action.payload
            }
        case GET_EMAIL_THREADS:
            return {
                ...state,
                all_threds:action.payload
            }
        default:
            return state
    }
}