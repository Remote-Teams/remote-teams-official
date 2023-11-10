import React from 'react';
import { connect } from 'react-redux';
import GoogleContacts from './Google/Dashboard';
import OWAContats from './OWA/Dashboard';

const Contacts = ( props ) => {
    const authApp = props.connectapp.auth;
     const active_account =  authApp.active_accounts[0];
     if( active_account.provider === "GOOGLE" ){
        return <GoogleContacts/>
     } else if ( active_account.provider === "MICROSOFT" ){
        return <OWAContats/>
     } else {
        return (
            <div>
                Contacts
            </div>
        )
     }
     console.log( active_account );
}
const mapStateToProps = state => ({
    connectapp : state.connectapp
})


export default  connect( mapStateToProps ,{})( Contacts );
