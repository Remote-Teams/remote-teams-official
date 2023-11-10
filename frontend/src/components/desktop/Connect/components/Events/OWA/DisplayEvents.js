import React from 'react';
import dateFns from 'date-fns';
import moment from 'moment';

const DisplayContacts = (props) => {
    let events = [];
    if( props.connectappEvent.all_events.value ){
        events = props.connectappEvent.all_events.value
    }
    return (
        <div className="display_contacts_main_container">
            <div className="events_table_container">
            {
                events.map(( data, index ) => (<EventsBlock key={ index } data={ data } { ...props }/>))
            }
            </div>
        </div>
    )
}

export default DisplayContacts;

export const EventsBlock = ( props ) => {
    const startData = dateFns.format( dateFns.parse( props.data.start.dateTime ), "do MMM YYYY HH:mm A" );
    const endDate =  dateFns.format( dateFns.parse( props.data.end.dateTime ), "do MMM YYYY HH:mm A" );
    return (
        <div className="events_block_container">
            <div className="title_block">
                <div className="event_title"> Title : { props.data.subject }</div>
                <div className="time_events">
                    Start - {startData} &emsp;
                    End -{endDate}
                </div>
            </div>
            <div className="description_block">
                <div className="events_description">{ props.data.bodyPreview }</div>
                <div className="edit_events_cions">
                        <div className="edit_cion" onClick={ props.onEdit( props.data ) }><i className="fa fa-pencil fa-lg" aria-hidden="true"></i></div>
                        <div className="edit_cion" onClick={ props.onDelete( props.data ) }><i className="fa fa-trash fa-lg" aria-hidden="true"></i></div>
                </div>
            </div>
        </div>
    )
}
