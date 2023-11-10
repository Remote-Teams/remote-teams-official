import React, { Component } from 'react';
import Loader from '../ReusableComponents/Loader';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { get_email_threads } from '../../store/actions/emailAction';
import ComposeEmail from './Google/ComposeEmail/ComposeEmail';

export class EmailDashboard extends Component {
    constructor(){
        super();
        this.state = {
            compose_email_model:false
        }
    }
    componentDidMount(){
        this.props.get_email_threads();
    }
    onComposeEmailModalHandler = ( value ) => e => {
        this.setState({ compose_email_model:true });
    }
    render() {
        return (
            <div className="email_dashboard">
                <div className="email_dashboard__top">
                    <div className="email_dashboard__top__left">
                        <ComposeEmail/>
                    </div>
                    <div className="email_dashboard__top__right"></div>
                </div>
                <div className="email_dashboard__bottom">
                    <div className="email_dashboard__bottom__left"></div>
                    <div className="email_dashboard__bottom__right"></div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    connectapp : state.connectapp
})

export default connect( mapStateToProps, { 
    get_email_threads
 })( withRouter( EmailDashboard ) );
