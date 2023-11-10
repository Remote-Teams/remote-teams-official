import axios from 'axios';
import Alert from "react-s-alert";
import { url } from '../../../../../store/actions/config';
import { CONTACTS_LOADERS, GET_ALL_CONTACTS } from '../types';

export const set_loader = () => dispatch => {
    dispatch({ type : CONTACTS_LOADERS, payload : true });
}

export const cleear_loader = () => dispatch => {
    dispatch({ type : CONTACTS_LOADERS, payload : false });
}

export const show_error = () => async dispatch => {
    Alert.warning("<p>Proble whie fetching uri</p>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
}

export const get_all_contacts = (params) => async dispatch  => {
    try{
        dispatch( set_loader() );
        let { data } = await axios.get(`${url}/api/connect/contacts?${params}`)
        if( data ){
            dispatch({
                type : GET_ALL_CONTACTS,
                payload :data
            });
            dispatch( cleear_loader() );
        }
    } catch ( err ){
        dispatch( cleear_loader() );
        dispatch( show_error() );
    }
}

export const create_new_contacts = ( formData, params ) => async dispatch => {
    try{
        dispatch( set_loader() );
        let { data } = await axios.post(`${url}/api/connect/contacts`, formData);
        if( data ){
            dispatch( get_all_contacts(  params ) );
            dispatch( cleear_loader() );
        }
    } catch ( err ){
        dispatch( cleear_loader() );
        dispatch( show_error() );
    }
}

export const update_contacts = ( formData, params ) => async dispatch =>  {
    try{
        dispatch( set_loader() );
        let { data } = await axios.put(`${url}/api/connect/contacts`, formData);
        if( data ){
            dispatch( get_all_contacts(  params ) );
            dispatch( cleear_loader() );
        }
    } catch ( err ){
        dispatch( cleear_loader() );
        dispatch( show_error() );
    }
}

export const delete_contacts = (params ) => async dispatch =>  {
    try{
        dispatch( set_loader() );
        let { data } = await axios.delete(`${url}/api/connect/contacts?${params}`);
        if( data ){
            dispatch( get_all_contacts(  params ) );
            dispatch( cleear_loader() );
        }
    } catch ( err ){
        dispatch( cleear_loader() );
        dispatch( show_error() );
    }
} 