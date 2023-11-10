import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { get_all_events, delete_events } from '../../../store/actions/eventAction';
import CreateEvents from './CreateEvents';
import DisplayEvents from './DisplayEvents';
import UpdateEvents from './UpdateEvents';

export class Dashboard extends Component {
    constructor(){
        super();
        this.state = {
            pageSize:10,
            start:0,
            end:10,
            tokens:[],
            pageNo:1,
            editValue:{}
        }
    }
    /*******************
     * @DESC - LIFECYCLE
     *******************/
    componentDidMount(){
        this.props.get_all_events();
    }
    onEdit = ( value ) => e => {
        this.setState({
            editValue:value
        })
    }
    onRemoveEditKey = () => {
        this.setState({
            editValue:{}
        })
    }
    onDelete = value => e => {
        if( window.confirm("Are you sure to delete this contact?") ){

            this.props.delete_events(`id=${value.id}`);
        }
    }
    onClickNext = e => {
        let token = this.state.tokens;
        let tokenNextPage = this.props.connectappEvent.all_events.nextPageToken;
        this.setState({
            start:(this.state.start+this.state.pageSize),
            end : (this.state.end + this.state.end ),
            pageNo:(this.state.pageNo +1  ),
            tokens:token
        })
        this.props.get_all_events(`pageToken=${tokenNextPage}`);
    }
    onClickPrevious = e => {
        let index = ( this.state.pageNo - 1 );
        console.log( this.state.tokens, index );
        let tokenNextPage = this.state.tokens[ index ];
        if( tokenNextPage === undefined ){
            this.props.get_all_events();
        } else {
            this.props.get_all_events(`pageToken=${tokenNextPage}`);   
        }
    }
    localProps = {
        onClickNext:this.onClickNext,
        onClickPrevious:this.onClickPrevious,
        onEdit:this.onEdit,
        onDelete:this.onDelete,
        onRemoveEditKey:this.onRemoveEditKey
    }
    render() {
        return (
            <div className="google_contacts_dashboard">
                <div className="contact_container_top">
                    <div className="contact_container_top__left">
                        <CreateEvents/>
                        { this.state.editValue.id ? <UpdateEvents { ...this.props } { ...this.state } { ...this.localProps } /> : null }
                    </div>
                    <div className="contact_container_top__right">

                        <PageController { ...this.props } { ...this.state } { ...this.localProps }/>
                    </div>
                </div>
                <div className="contact_dashboard_bottom">
                    <DisplayEvents { ...this.props } { ...this.localProps }/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    connectappAuth : state.connectapp.auth,
    connectappEvent:state.connectapp.events,
});

export default connect( mapStateToProps, {
    get_all_events, delete_events
})( withRouter( Dashboard ) );

export const PageController = ( props ) => {
    return (
        <div className="page_controller_main_containers">
            <div className="count_section">
                Showing { props.start } - { props.end }
            </div>
            <div className="controller_section">
                <div className="controller" onClick={ props.onClickPrevious }><i className="fa fa-caret-left fa-2x" aria-hidden="true"></i></div>
                <div className="controller" onClick={ props.onClickNext }><i className="fa fa-caret-right fa-2x" aria-hidden="true"></i></div>
            </div>
        </div>
    )
}