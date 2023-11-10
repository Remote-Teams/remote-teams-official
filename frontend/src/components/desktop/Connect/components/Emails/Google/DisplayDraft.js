import React from 'react';
import { Checkbox } from '@material-ui/core';
import { StarBorder, Star } from '@material-ui/icons';
import dateFns from 'date-fns';

const DisplayDraft = (props) => {
    let all_drafts = [];
    if( props.connectappEmail.all_drafts.messages ){
        all_drafts = props.connectappEmail.all_drafts.messages
    }
    return (
        <div className="display_draft_main_container">
            {
                all_drafts.map( ( draft, index ) => {
                    let subject = draft.payload.headers.find( data => data.name === "Subject" );
                    let snippet = draft.snippet;
                    let date   = draft.payload.headers.find( data => data.name === "Date" ); 
                    
                    return (
                    <div key={ index } className="draft_block_container">
                        <div className="checkbox_container">
                            <Checkbox 
                                // checked={state.checkedB}
                                // onChange={handleChange}
                                name="checkedB"
                                color="primary"
                                size="medium"
                            />
                        </div>
                        <div className="star_container"><StarBorder fontSize={'large'}/></div>
                        <div className="name_container">{ "Drafts" }</div>
                        <div className="subject_container">{ ( subject && subject.value !== "") ? subject.value.substring(0,50)+" ..." : "(no subject)" }</div>
                        <div className="snippet_container">{ snippet.substring(0,50)+" ..." }</div>
                        <div className="date_container">{ dateFns.format( dateFns.parse( date.value ), "Do MMM YYYY HH:mm" )  }</div>
                        <div className="edit_icon_containers">
                            <div className="edit_cion" onClick={ props.onEdit( draft, index ) }><i className="fa fa-pencil fa-lg" aria-hidden="true"></i></div>
                            <div className="edit_cion" onClick={ props.onDelete( draft, index ) }><i className="fa fa-trash fa-lg" aria-hidden="true"></i></div>
                        </div>
                    </div>
                )})
            }
        </div>
    )
}

export default DisplayDraft
