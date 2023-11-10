import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Loader from '../ReusableComponents/Loader';
import ServiceActivationPage from '../ServiceActivationPage/ServiceActivationPage';
import { getConnectAccounts, updateSingleAccounts } from '../../store/actions/authAction';
import BannerIMage from '../../assets/img/SettingPage/banner.svg';
import mailboximage from '../../assets/img/SettingPage/mailbox.svg';
import CircleOne from '../../assets/img/SettingPage/circle1.svg';
import CicleTwo from '../../assets/img/SettingPage/circle2.svg';
import OrLine from '../../assets/img/SettingPage/leads.svg';
import BlLine from '../../assets/img/SettingPage/leads1.svg';
import Checkbox from '@material-ui/core/Checkbox';
import ServiceHalted from '../ServiceHaltedPage/ServiceHaltedPage';



export class SettingPage extends Component {
    constructor(){
        super();
        this.state = {}
    }
    componentDidMount(){
        this.props.getConnectAccounts();
    }
    isConnectDefaultClientHandler = data => e => {
        let formData = JSON.parse(JSON.stringify(data));
        formData.isConnectDefaultClient = !formData.isConnectDefaultClient;
        console.log( formData );
        this.props.updateSingleAccounts( formData._id, formData );
    }
    stopSyncAccount = data => e => {
        let formData = JSON.parse(JSON.stringify(data));
        formData.isConnectDefaultClient = false;
        formData.status = "NOTACTIVE";
        this.props.updateSingleAccounts( formData._id, formData );
    }
    onReconnectAccount = data => e => {
        let formData = JSON.parse(JSON.stringify(data));
        formData.isConnectDefaultClient = false;
        formData.status = "ACTIVE";
        this.props.updateSingleAccounts( formData._id, formData );
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
            <div className="setting_page__main_container_mailbox">
                <div className="setting_page__main_container_mailbox__left">
                    <BannerContainer { ...authProp } { ...this.props }/>
                </div>
                <div className="setting_page__main_container_mailbox__right">
                    <MailboxSettingHeadline/>
                    <Headline srcImage={CircleOne} name={"Currently Synced"} />
                    <ActiveAccounts { ...this.props } isConnectDefaultClientHandler={ this.isConnectDefaultClientHandler } stopSyncAccount={ this.stopSyncAccount } />
                    <Headline srcImage={CicleTwo} name={"Previously Synced"} />
                    <NotActiveAccounts  { ...this.props } onReconnectAccount={ this.onReconnectAccount } />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    connectapp : state.connectapp
})
export default connect( mapStateToProps, {
    getConnectAccounts,
    updateSingleAccounts
} )( withRouter( SettingPage ) );

const BannerContainer = ( props ) => {
   return (
    <>
        <div className="banner_container__img">
            <img src={ BannerIMage } alt="banner_iamge" />
        </div>
        <div className="button_goBack">
            <button onClick={ () => props.history.push('/mailbox') }>Go to mailbox</button>
        </div>
    </>
   )
}

const MailboxSettingHeadline = ( props ) => {
    return (
        <div className="mailbox_setting_headline">
            <div className="mailbox__icons">
                <img src={mailboximage} alt={"Image settings"} />
            </div>
            <div className="textbox_text">Mailbox settings</div>
        </div>
    )
}

export const Headline = (props) => {
    return (
        <div className="headline_for_mail">
            <div className="icons_place"><img src={props.srcImage} alt="iamge_srs" /></div>
            <div className="headline_text_mail">{ props.name }</div>
        </div>
    )
}

export const ActiveAccounts = ( props ) => {
    const authApp = props.connectapp.auth;
    console.log( authApp );
    const active_account =  authApp.active_accounts[0];
    return (
        <div className="active__accounts_main_container">
            <div className="pipe_container">
                <img src={BlLine} alt="pipeimage"/>
            </div>
            <div className="content__container">
                {
                    authApp.active_accounts.length > 0 ? 
                    <>
                        <div className="active_accounts_account">
                            <div className="email_name">{ authApp.active_accounts[0].integrated_email }</div>
                            <div className="stop_sync_button_email"><button onClick={ props.stopSyncAccount( active_account ) }>Stop Sync</button></div>
                        </div>
                        <div className="use_as_default_account">
                            <div className="ac_email_checkbox">
                            <Checkbox
                                checked={active_account.isConnectDefaultClient}
                                color="primary"
                                size="medium"
                                onChange={props.isConnectDefaultClientHandler(active_account)}
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                            />
                            </div>
                            <div className="ac_email_text">
                                Use this mail address as default sender's mail address across the workspace
                            </div>
                        </div>   
                    </> : null
                }
            </div>
        </div>
    )
}  

export const NotActiveAccounts = ( props ) => {
    const authApp = props.connectapp.auth;
    const inactive_accounts =  authApp.inactive_accounts;
    return (
        <div className="inactive__accounts_main_container">
            <div className="pipe_container">
                <img src={OrLine} alt="pipeimage"/>
            </div>
            <div className="content__container">
                {
                    inactive_accounts.length > 0 ? 
                        inactive_accounts.map( (account, index) => (
                            <div key={ index } className="active_accounts_account">
                                <div className="email_name">{ account.integrated_email }</div>
                                <div className="stop_sync_button_email"><button className="reconnect_button" onClick={ props.onReconnectAccount( account ) }>Re-connect</button></div>
                            </div>
                        ))
                    : null
                }
            </div>
        </div>
    )
}