import React from 'react';
import { connect } from 'react-redux';
import GoogleDashboard from './Google/Dashboard';
import MicrosoftDashboard from './OWA/Dashboard';

const Contacts = ( props ) => {
    const authApp = props.connectapp.auth;
     const active_account =  authApp.active_accounts[0];
     if( active_account.provider === "GOOGLE" ){
         return <GoogleDashboard/>
     } else if ( active_account.provider === "MICROSOFT" ){
        return <MicrosoftDashboard/>
     } else {
        return (
            <div>
                unable to verify your dashboard
            </div> 
        )
     }
}
const mapStateToProps = state => ({
    connectapp : state.connectapp
})


export default  connect( mapStateToProps ,{})( Contacts );
