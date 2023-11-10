import { EVENT_LOADERS, GET_ALL_EVENTS } from "../types";

const initialState = {
    loader: false,
    all_events:[]
}

export default function ( state = initialState, action ){
    switch( action.type ){
        case EVENT_LOADERS:
            return {
                ...state,
                loader : action.payload
            }
        case GET_ALL_EVENTS:
            return {
                ...state,
                all_events:action.payload
            }
        default:
            return state
    }
}