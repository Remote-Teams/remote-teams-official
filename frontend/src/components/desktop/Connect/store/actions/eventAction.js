import axios from 'axios';
import Alert from "react-s-alert";
import { url } from '../../../../../store/actions/config';
import { EVENT_LOADERS, GET_ALL_EVENTS } from '../types';

export const set_loader = () => dispatch => {
    dispatch({ type : EVENT_LOADERS, payload : true });
}

export const cleear_loader = () => dispatch => {
    dispatch({ type : EVENT_LOADERS, payload : false });
}

export const show_error = () => async dispatch => {
    Alert.warning("<p>Error in events</p>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
}

export const get_all_events = ( params ) => async dispatch => {
    try{
        dispatch( set_loader() );
        let { data } = await axios.get(`${ url }/api/connect/events?${ params }`);
        if( data ){
            dispatch({
                type : GET_ALL_EVENTS,
                payload : data  
            });
            dispatch( cleear_loader() );
        }
    } catch ( err ){
        dispatch( cleear_loader() );
        dispatch( show_error() );
    }
}

export const create_new_events = ( formData, params ) => async dispatch => {
    try{
        dispatch( set_loader() );
        let { data } = await axios.post(`${ url }/api/connect/events`, formData);
        if( data ){
            dispatch( get_all_events(params) );
            dispatch( cleear_loader() );
        }
    } catch ( err ){
        dispatch( cleear_loader() );
        dispatch( show_error() );
    }
};

export const update_events = ( formData, params ) => async dispatch => {
    try{
        dispatch( set_loader() );
        let { data } = await axios.put(`${ url }/api/connect/events`, formData);
        if( data ){
            dispatch( get_all_events(params) );
            dispatch( cleear_loader() );
        }
    } catch ( err ){
        dispatch( cleear_loader() );
        dispatch( show_error() );
    }
};

export const delete_events = ( params, options ) => async dispatch => {
    try{
        dispatch( set_loader() );
        let { data } = await axios.delete(`${ url }/api/connect/events?${ params }`);
        if( data ){
            dispatch( get_all_events(options) );
            dispatch( cleear_loader() );
        }
    } catch ( err ){
        dispatch( cleear_loader() );
        dispatch( show_error() );
    }
}