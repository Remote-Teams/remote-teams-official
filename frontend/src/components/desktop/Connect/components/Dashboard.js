import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ServiceActivationPage from './ServiceActivationPage/ServiceActivationPage';
import ServiceHalted from './ServiceHaltedPage/ServiceHaltedPage';
import Loader from './ReusableComponents/Loader';
import { getConnectAccounts } from '../store/actions/authAction';
import MainGrids from './MainGrids/MainGrids';
// MATERIAL UI SETTINGS 

export class Dashboard extends Component {
    constructor(){
        super();
        this.state = {

        }
    }

    componentDidMount(){
        this.props.getConnectAccounts();
    }
    render() {
        let authProp = this.props.connectapp.auth;
        if( authProp.auth_loader ){
            return <Loader/>
        }
        if( authProp.active_accounts.length === 0 && authProp.inactive_accounts.length === 0 ){
            return <ServiceActivationPage/>
        }
        if( authProp.active_accounts.length === 0 && authProp.inactive_accounts.length > 0 ){
            return <ServiceHalted/>
        }
        return (
            <MainGrids/>
        )
    }
}

const mapStateToProps = state => ({
    connectapp : state.connectapp
})

export default connect( mapStateToProps, { 
    getConnectAccounts
 })( withRouter( Dashboard ) );
