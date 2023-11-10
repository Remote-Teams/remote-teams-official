import React from 'react';
import Banner from '../../assets/img/service_activation_page/Banner.svg';
import GoogleIcon from '../../assets/img/service_activation_page/google.svg';
import OutlookIcon from '../../assets/img/service_activation_page/outlook.svg';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { requestauthorizeUrl } from '../../store/actions/authAction';

const ServiceActivationPage = (props) => {
    return (
        <div className="service_activation__main_container">
            <div className="banner_sec__col">
                <img src={ Banner } alt="bannerimage" />
            </div>
            <div className="headline_sec_col">Lets get started</div>
            <div className="paragrapgh_sec_col">Please sign in to your google or OWA account to sync your mailbox</div>
            <div className="button_sec__col">
                <button className="button_simple" onClick={ () => props.requestauthorizeUrl("GOOGLE") }>&emsp;<img src={GoogleIcon} alt="image_alt" />&emsp;Login using Google</button>
                <button className="button_simple owa_button"  onClick={ () => props.requestauthorizeUrl("MICROSOFT") }>&emsp;<img src={OutlookIcon} alt="image_alt"/>&emsp;Login using OWA</button>
            </div>
            <div className="dashboard_section">
                <div onClick={ () => props.history.push('/dashboard') }>Go to Dashboard</div>
            </div>
        </div>
    )
}

export default connect( null, { requestauthorizeUrl } )( withRouter( ServiceActivationPage ) );
