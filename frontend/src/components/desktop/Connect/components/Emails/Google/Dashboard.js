import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import DisplayDraft from './DisplayDraft';
import DisplayThreads from './DisplayThreads';
import UpdateDraft from './UpdateEmail';
import CreateNewEmail from './CreateEmails';
import ViewThreads from './ViewThreads';
import { get_all_drafts, get_email_threads, delete_draft, delete_threads, update_emails } from '../../../store/actions/emailAction';

export class Dashboard extends Component {
    constructor(){
        super();
        this.state = {
            pageSize:10,
            start:0,
            end:10,
            tokens:[],
            pageNo:1,
            editValue:{},
            editIndex:"",
            menu:"Inbox",
            selectAll:false,
            selected_stack:[],
            viewThread:{}
        }
    }
    /**** LIFE CYCLE METHODS ******/
    componentDidMount(){
        this.props.get_email_threads(`labelIds=INBOX`);
    }
    componentDidUpdate(prevProps, prevState){
        if( prevState.menu !== this.state.menu ) {
            if( this.state.menu === "Inbox" ){
                this.props.get_email_threads(`labelIds=INBOX`);
            }
            if( this.state.menu === "Draft" ){
                this.props.get_all_drafts();
            }
            if( this.state.menu === "Sent Mail" ){
                this.props.get_email_threads(`labelIds=SENT`);
            }
            if( this.state.menu === "Outbox" ){
                this.props.get_email_threads(`labelIds=SENT`);
            }
            if( this.state.menu === "Starred" ){
                this.props.get_email_threads(`labelIds=STARRED`);
            }
            if( this.state.menu === "Trash" ){
                this.props.get_email_threads(`labelIds=TRASH`);
            }
        }
    }
    onSelectionHandler = value => e => {
        console.log( value, e );
    }
    // MENU SELECT HANDLER
    onMenuSelectHandler = value => e => {
        this.setState({
            menu : value,
            viewThread:{}
        })
    }
    onStarChangeHandler = value => e => {
        let formData = { 
            id : value.id,
            addLabelIds:[],
            removeLabelIds:[]
        };
        if( value.starred ){
            formData.removeLabelIds = ["STARRED"];
        } else {
            formData.addLabelIds = ["STARRED"];
        }
        this.props.update_emails( formData,`type=thread` );
    }
    onSelectAllHandler = e => {
        this.setState({
            selectAll:!this.state.selectAll
        })
    }
    // VIEW THREAD
    viewthreadHandler = value => e => {
        this.setState({
            viewThread: value
        })
    }
    // EDIT & DELETE HDNELR || NEXT PREVIOUSR
    onClickNext = e => {
        let token = this.state.tokens;
        if( this.state.menu === "Inbox" ){
            let tokenNextPage = this.props.connectappEmail.all_threds.threads.nextPageToken;
            this.props.get_email_threads(`labelIds=INBOX&pageToken=${tokenNextPage}`);
            token.push(tokenNextPage);
            this.setState({
                start:(this.state.start+this.state.pageSize),
                end : (this.state.end + this.state.end ),
                pageNo:(this.state.pageNo +1  ),
                tokens:token
            })
        }
        if( this.state.menu === "Draft" ){
            let tokenNextPage = this.props.connectappEmail.all_drafts.threads.nextPageToken;
            this.props.get_all_drafts(`pageToken=${tokenNextPage}`);
            token.push(tokenNextPage);
            this.setState({
                start:(this.state.start+this.state.pageSize),
                end : (this.state.end + this.state.end ),
                pageNo:(this.state.pageNo +1  ),
                tokens:token
            })
        }
        if( this.state.menu === "Sent Mail" ){
            let tokenNextPage = this.props.connectappEmail.all_threds.threads.nextPageToken;
            this.props.get_email_threads(`labelIds=SENT&pageToken=${tokenNextPage}`);
            token.push(tokenNextPage);
            this.setState({
                start:(this.state.start+this.state.pageSize),
                end : (this.state.end + this.state.end ),
                pageNo:(this.state.pageNo +1  ),
                tokens:token
            })
        }
        if( this.state.menu === "Outbox" ){
            let tokenNextPage = this.props.connectappEmail.all_threds.threads.nextPageToken;
            this.props.get_email_threads(`labelIds=SENT&pageToken=${tokenNextPage}`);
            token.push(tokenNextPage);
            this.setState({
                start:(this.state.start+this.state.pageSize),
                end : (this.state.end + this.state.end ),
                pageNo:(this.state.pageNo +1  ),
                tokens:token
            })
        }
        if( this.state.menu === "Starred" ){
            let tokenNextPage = this.props.connectappEmail.all_threds.threads.nextPageToken;
            this.props.get_email_threads(`labelIds=STARRED&pageToken=${tokenNextPage}`);
            token.push(tokenNextPage);
            this.setState({
                start:(this.state.start+this.state.pageSize),
                end : (this.state.end + this.state.end ),
                pageNo:(this.state.pageNo +1  ),
                tokens:token
            })
        }
        if( this.state.menu === "Trash" ){
            let tokenNextPage = this.props.connectappEmail.all_threds.threads.nextPageToken;
            this.props.get_email_threads(`labelIds=TRASH&pageToken=${tokenNextPage}`);
            token.push(tokenNextPage);
            this.setState({
                start:(this.state.start+this.state.pageSize),
                end : (this.state.end + this.state.end ),
                pageNo:(this.state.pageNo +1  ),
                tokens:token
            })
        }
    }
    onClickPrevious = e => {
        let index = ( this.state.pageNo - 1 );
        let tokenNextPage = this.state.tokens[ index ];
        if( this.state.menu === "Inbox" ){
            this.props.get_email_threads(`labelIds=INBOX&pageToken=${tokenNextPage}`);
        }
        if( this.state.menu === "Draft" ){
            this.props.get_all_drafts(`pageToken=${tokenNextPage}`);
        }
        if( this.state.menu === "Sent Mail" ){
            this.props.get_email_threads(`labelIds=SENT&pageToken=${tokenNextPage}`);
        }
        if( this.state.menu === "Outbox" ){
            this.props.get_email_threads(`labelIds=SENT&pageToken=${tokenNextPage}`);
        }
        if( this.state.menu === "Starred" ){
            this.props.get_email_threads(`labelIds=STARRED&pageToken=${tokenNextPage}`);
        }
        if( this.state.menu === "Trash" ){
            this.props.get_email_threads(`labelIds=TRASH&pageToken=${tokenNextPage}`);
        }
    }
    onEdit = ( value, index ) => e => {
        this.setState({
            editValue:value,
            editIndex:index
        })
    }
    onRemoveEditKey = () => {
        this.setState({
            editValue:{},
            editIndex:""
        })
    }
    onDelete = ( value, index ) => e => {
        if( window.confirm("Are you sure to delete this contact?") ){
            if( this.state.menu === "Draft" ){
                let id = this.props.connectappEmail.all_drafts.threads.drafts[index].id;
                this.props.delete_draft(`id=${id}`);
            } else {
                let id = this.props.connectappEmail.all_threds.threads.threads[index].id;
                this.props.delete_threads(`id=${id}`);
            }
        }
    }
    localProps = {
        onMenuSelectHandler:this.onMenuSelectHandler,
        onSelectionHandler:this.onSelectionHandler,
        onSelectAllHandler:this.onSelectAllHandler,
        onClickNext:this.onClickNext,
        onClickPrevious:this.onClickPrevious,
        onEdit:this.onEdit,
        onDelete:this.onDelete,
        onRemoveEditKey:this.onRemoveEditKey,
        viewthreadHandler:this.viewthreadHandler,
        onStarChangeHandler:this.onStarChangeHandler
    }
    render() {
        return (
            <div className="main_container_email_dashboard">
                <div className="main_container_email_dashboard__top">
                    <div className="main_container_email_dashboard__top__left"><CreateNewEmail/></div>
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
                            this.state.menu === "Draft" ? <DisplayDraft { ...this.state } { ...this.localProps } { ...this.props } />: null
                        }
                        {
                            this.state.menu !== "Draft" && !this.state.viewThread.id ? <DisplayThreads  { ...this.state } { ...this.localProps } { ...this.props } /> : null
                        }
                        {
                            this.state.menu !== "Draft" && this.state.viewThread.id ? <ViewThreads { ...this.state } { ...this.localProps } { ...this.props }/> : null
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

export default connect( mapStateToProps, {
    get_all_drafts,
    get_email_threads,
    delete_draft,
    delete_threads,
    update_emails
} )( withRouter( Dashboard ) );


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
    { icon:"fa fa-archive fa-2x", name:"Draft" },
    { icon:"fa fa-paper-plane fa-2x", name:"Sent Mail" },
    { icon:"fa fa-envelope fa-2x", name:"Outbox" },
    { icon:"fa fa-star fa-2x", name:"Starred" },
    { icon:"fa fa-trash fa-2x", name:"Trash" },
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