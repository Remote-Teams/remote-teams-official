import { CONTACTS_LOADERS, GET_ALL_CONTACTS } from "../types";

const initialState = {
    loader: false,
    all_contacts:[]
}

export default function ( state = initialState, action ){
    switch( action.type ){
        case CONTACTS_LOADERS:
            return {
                ...state,
                loader : action.payload
            }
        case GET_ALL_CONTACTS:
            return {
                ...state,
                all_contacts:action.payload
            }
        default:
            return state
    }
}