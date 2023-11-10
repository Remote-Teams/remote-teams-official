import React from 'react';
import { connect } from 'react-redux';
import GoogleEvents from './Google/Dashboard';
import OWAEvents from './OWA/Dashboard';

const Events = ( props ) => {
    const authApp = props.connectapp.auth;
     const active_account =  authApp.active_accounts[0];
     if( active_account.provider === "GOOGLE" ){
        return <GoogleEvents/>
     } else if ( active_account.provider === "MICROSOFT" ){
        return <OWAEvents/>
     } else {
        return (
            <div>
                EVENTS
            </div>
        )
     }
}
const mapStateToProps = state => ({
    connectapp : state.connectapp
})


export default  connect( mapStateToProps ,{})( Events );
