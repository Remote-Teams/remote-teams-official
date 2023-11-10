import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { sendauthorizeCode } from '../../store/actions/authAction';

const ServiceCallbackPage = ( props ) => {

    var search = decodeURIComponent( props.history.location.search );
    search = search.replace("?","");
    let search_array = search.split("&");
    let search_query = {};
    search_array.forEach( data => {
        let split_data = data.split("=");
        let key = split_data[0];
        let value;
        if( key === "state" ){
            value = split_data[1];
        } else {
           value = split_data[1];
        }
        search_query[key] = value;
    });
    search_query.state = JSON.parse(search_query.state);
    let formData = {
        code :search_query.code,
        ...search_query.state
    }
    console.log( formData );
    props.sendauthorizeCode( formData );
    return (
        <div>
            This is service activation page. Please donot refresh.
        </div>
    )
}

export default connect( null, { sendauthorizeCode } )( withRouter( ServiceCallbackPage ) );
