import React from 'react';
import { Base64 } from 'js-base64';
import ViewThreadOptions from './ViewThreadOPtions';

const ViewThreads = ( props ) => {
    let message = props.viewThread;
    return (
        <div className="display_thread_main_container">
                        <div className="single_message_main_container">
                            <div className="col_one_m">
                                <NameDetails { ...message }/>
                                <div className="option_container">
                                    <ViewThreadOptions message={ message } { ...props } />
                                </div>
                            </div>
                            <div className="col_two_m">
                                <SubjectDetails { ...message }/>
                            </div>
                            <div className="col_three_m">
                                <div id="sandy"></div>
                                <BodyDetails { ...message }/>
                            </div>
                        </div>
        </div>
    )
}

export default ViewThreads;


export const NameDetails = ( props ) => {
    let from = props.sender.emailAddress.name + " " + props.sender.emailAddress.address ;
    let to = props.toRecipients.map( data => data.emailAddress.address ).toString();
    return (
        <div className="address_container_m">
            <div className="from_email_details"> <span className="view_labels">From : &nbsp;</span> { from ? from : "" }</div>
            <div className="to_email_details"> <span className="view_labels">To : &nbsp;</span>  { to ? to : "" }</div>
        </div>
    )
}

export const SubjectDetails = ( props ) => {
    let subject = props.subject ? props.subject : "" ;
    return (
        <div className="subject_details">{ subject }</div>
    )
}

export const BodyDetails = ( props ) => {
let body = props.body.content;
    return (
        <div className="body_details">
            <div dangerouslySetInnerHTML={{__html: body}} /></div>
    )
}