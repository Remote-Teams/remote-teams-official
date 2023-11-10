import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { get_email_threads, delete_threads } from '../../../store/actions/emailAction';
import DisplayEmails from './DisplayEmails';
import DisplayDraft from './DisplayDrafts';
import CreateEmail from './CreateEmail';
import UpdateDraft from './UpdateDraft';
import ViewMessage from './ViewMessage';

export class Dashboard extends Component {
    constructor(){
        super();
        this.state = {
            pageSize:10,
            start:0,
            end:10,
            menu:"Inbox",
            viewThread:{},
            editValue:{}
        }
    }
    /**************************
     * @DESC - lIFECYCLE METHODS
     ***************************/
    componentDidMount(){
        this.props.get_email_threads(`labelIds=Inbox`);
    }
    componentDidUpdate(prevProps, prevState){
        if( prevState.menu !== this.state.menu ) {
            this.props.get_email_threads(`labelIds=${this.state.menu}`);
        }   
    }
    onMenuSelectHandler = value => e => {
        this.setState({
            menu : value,
            viewThread:{},
            editValue:{}
        })
    }
    onClickMessageHandler = value => e => {
        this.setState({ viewThread : value });
    }
    onEdit = value => e => {
        this.setState({
            editValue:value
        })
    };
    onRemoveEditKey = e => {
        this.setState({
            viewThread:{},
            editValue:{}
        })
    }

    onDelete = ( value, index ) => e => {
        if( window.confirm("Are you sure to delete this email?") ){
            this.props.delete_threads(`id=${value.id}`,`labelIds=${this.state.menu}`);
        }
    }
    localProps = {
        onMenuSelectHandler:this.onMenuSelectHandler,
        onEdit:this.onEdit,
        onDelete:this.onDelete,
        onRemoveEditKey:this.onRemoveEditKey,
        onClickMessageHandler:this.onClickMessageHandler
    }
    render() {
        console.log( this.state );
        return (
            <div className="main_container_email_dashboard">
                <div className="main_container_email_dashboard__top">
                    <div className="main_container_email_dashboard__top__left"><CreateEmail/></div>
                    <div className="main_container_email_dashboard__top__right">
                        <PageController { ...this.state } { ...this.localProps }/>
                        {
                            this.state.editValue.id ? <UpdateDraft  { ...this.state } { ...this.localProps }/> : null
                        }
                    </div>
                </div>
                <div className="main_container_email_dashboard__bottom">
                    <div className="main_container_email_dashboard__bottom__left">
                        <LeftMenuController { ...this.state } { ...this.localProps }/>
                    </div>
                    <div className="main_container_email_dashboard__bottom__right">
                        {
                            this.state.menu === "Drafts" && !this.state.viewThread.id ? <DisplayDraft { ...this.state } { ...this.localProps } { ...this.props } />: null
                        }
                        {
                            this.state.menu !== "Drafts" && !this.state.viewThread.id ? <DisplayEmails  { ...this.state } { ...this.localProps } { ...this.props } />:null
                        }
                        {
                            this.state.viewThread.id ? <ViewMessage { ...this.state } { ...this.localProps } { ...this.props }  /> : null
                        }
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    connectappAuth : state.connectapp.auth,
    connectappEmail : state.connectapp.email
})

export default connect(mapStateToProps, { 
    get_email_threads,
    delete_threads
 })( withRouter(Dashboard) );


 export const PageController = ( props ) => {
    return (
        <div className="page_controller_main_containers">
            <div className="count_section">
                Showing { props.start } - { props.end } of 
            </div>
            <div className="controller_section">
                <div className="controller" onClick={ props.onClickPrevious }><i className="fa fa-caret-left fa-2x" aria-hidden="true"></i></div>
                <div className="controller" onClick={ props.onClickNext }><i className="fa fa-caret-right fa-2x" aria-hidden="true"></i></div>
            </div>
        </div>
    )
}

const MenuList = [
    { icon:"fa fa-inbox fa-2x", name:"Inbox" },
    { icon:"fa fa-archive fa-2x", name:"Drafts" },
    { icon:"fa fa-paper-plane fa-2x", name:"SentItems" },
    { icon:"fa fa-envelope fa-2x", name:"Outbox" },
    { icon:"fa fa-trash fa-2x", name:"DeletedItems" },
]
export const LeftMenuController = ( props ) => {
    return (
        <div className="left_menu_controller">
            <div className="menu_section">
                {
                    MenuList.map( (menu, index) => (
                        <div key={index} className={ props.menu === menu.name ? "menu_controller_active" : "menu_controller" } onClick={ props.onMenuSelectHandler(menu.name) }>
                            <div className="menu_icon"><i className={ menu.icon } aria-hidden="true"></i></div>
                            <div className="menu_text">{ menu.name }</div>
                        </div>
                    ) )
                }
            </div>
            <div className="exit_section">
                <button onClick={ () => window.location.href = "/dashboard" }>Exit</button>
            </div>
        </div>
    )
}