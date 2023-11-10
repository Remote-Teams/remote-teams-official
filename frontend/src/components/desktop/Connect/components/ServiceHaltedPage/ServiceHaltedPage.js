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
// import Checkbox from '@material-ui/core/Checkbox';


export class ServiceHaltedPage extends Component {
    constructor(){
        super();
        this.state = {
            add_account:false
        }
    }

    addAccountHandler = e => {
        this.setState({
            add_account:true
        })
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
        if( this.state.add_account ){
            return <ServiceActivationPage/>
        }
        return (
            <div className="setting_page__main_container_mailbox">
                <div className="setting_page__main_container_mailbox__left">
                    <BannerContainer { ...authProp } { ...this.props }/>
                </div>
                <div className="setting_page__main_container_mailbox__right">
                    <MailboxSettingHeadline/>
                    <Headline srcImage={CircleOne} name={"Currently Synced"} />
                    <ActiveAccounts { ...this.props } addAccountHandler={ this.addAccountHandler }/>
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
} )( withRouter( ServiceHaltedPage ) );



const BannerContainer = ( props ) => {
    return (
     <>
         <div className="banner_container__img">
             <img src={ BannerIMage } alt="banner_iamge" />
         </div>
         <div className="button_goBack">
             <button onClick={ () => props.history.push('/dashboard') }>Go to Dashboard</button>
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
     const active_account =  authApp.active_accounts[0];
     return (
         <div className="active__accounts_main_container">
             <div className="pipe_container">
                 <img src={BlLine} alt="pipeimage"/>
             </div>
             <div className="content__container_halted">
                <div className="halted_text">No account synced, please add new account or reconnect previously used accounts</div>
                <div className="halted_button">
                    <button onClick={ props.addAccountHandler }>Add new account</button>
                </div>
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
