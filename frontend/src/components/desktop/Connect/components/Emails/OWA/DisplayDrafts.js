import React from 'react';
import { Checkbox } from '@material-ui/core';
import { FlagOutlined, FlagSharp } from '@material-ui/icons';
import dateFns from 'date-fns';

const DisplayDraft = (props) => {
    let all_messages = [];
    if( props.connectappEmail.all_threds.value ){
        all_messages= props.connectappEmail.all_threds.value;
    }
    return (
        <div className="display_draft_main_container">
            {
                all_messages.map( ( message, index ) => {
                    let subject = message.bodyPreview;
                    let snippet = message.subject;
                    let date   = message.createdDateTime;
                    let name = message.from ? message.from.emailAddress.name : "Drafts";
                    let flag = message.flag
                    
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
                            <div className="star_container">{ flag ? flag.flagStatus === "flagged" ? <FlagSharp fontSize={'large'}/> : <FlagOutlined fontSize={'large'}/> : <FlagOutlined fontSize={'large'}/> }</div>
                            <div className="name_container">{ "Drafts" }</div>
                            <div className="subject_container" onClick={ props.onClickMessageHandler( message ) }>{ ( subject !== "") ? subject.substring(0,50)+" ..." : "(no subject)" }</div>
                            <div className="snippet_container" onClick={ props.onClickMessageHandler( message ) }>{ snippet.substring(0,50)+" ..." }</div>
                            <div className="date_container" onClick={ props.onClickMessageHandler( message ) }>{ dateFns.format( dateFns.parse( date ), "Do MMM YYYY HH:mm" )  }</div>
                            <div className="edit_icon_containers">
                            <div className="edit_cion" onClick={ props.onEdit( message, index ) }><i className="fa fa-pencil fa-lg" aria-hidden="true"></i></div>
                            <div className="edit_cion" onClick={ props.onDelete( message, index ) }><i className="fa fa-trash fa-lg" aria-hidden="true"></i></div>
                            </div>
                        </div>
                )})
            }
        </div>
    )
}

export default DisplayDraft
