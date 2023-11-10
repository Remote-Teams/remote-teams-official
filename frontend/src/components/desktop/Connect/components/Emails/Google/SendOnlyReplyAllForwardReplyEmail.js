import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { send_new_email } from '../../../store/actions/emailAction';
import WrapperComponent from './WrapperComponent';
import Button from '@material-ui/core/Button';
import ChipInput from 'material-ui-chip-input';
import TextInput from '../../Contacts/ReusableComponent/TextInput';
import Body from './Body';
import { Base64 } from 'js-base64';


export class CreateEmails extends Component {
    constructor(){
        super();
        this.state = {
            emailModal:true,
            id:"",
            from:"",
            to:[],
            cc:[],
            subject:"",
            body:"",
            attachments:[]
        }
    }

    componentDidMount(){
        let payloads = this.props.editValue.payload.headers;
        let parts = this.props.editValue.payload.parts;
        let body = "";
        let to = "";
        let cc = "";
        let all_emails = payloads.filter( elem => elem.name === "From" || elem.name === "To" ||  elem.name === "Reply-To" );
        all_emails = all_emails.map( elem => elem.value );
        cc = payloads.filter( data => data.name === "Cc" ).map( elm => elm.value );
        let reply = payloads.filter( elem => elem.name === "From").map( elm => elm.value );
        if( this.props.type === "replyAll" ){
            to = all_emails;
        } else if( this.props.type === "forward" ){
            to=[];
        } else {
            to = reply;
        }
        if( parts !== undefined ){
            body = parts.find( data => data.mimeType === "text/html" ).body.data;
        } else {
            body = this.props.editValue.payload.body.data;
        }
        let data = {
            id: this.props.editValue.id,
            // from:payloads.find( data => data.name === "From" ) ? payloads.find( data => data.name === "From" ).value : "",
            to:to,
            cc:payloads.find( data => data.name === "Cc" ) ? payloads.find( data => data.name === "Cc" ).value.split(",") : [],
            subject:payloads.find( data => data.name === "Subject" ) ? payloads.find( data => data.name === "Subject" ).value : [],
            body: body ?  Base64.decode( body ) : "" 
        }
        this.setState({
            ...data
        })
    }

    onClose = e => {
        this.props.onCloseModel();
    }
    onModalToggler = value => e => {
        if( value === false ){
            this.onClose();
        }
        this.setState({
            emailModal:value
        })
    }
    // INPUT HANDLERS
    handleAddChip = (value, name) =>  {
        let data = this.state[name];
        data.push( value );
        this.setState({ [name] : data });
    }
    handleDeleteChip = ( chip, index, name ) => {
        let data = this.state[name];
        data.splice( index, 1 );
        this.setState({ [name] : data });
    }
    onChange = e => {
        this.setState({
            [e.target.name]:e.target.value
        })
    }
    onEditorChangeHandler = e => {
        this.setState({
            body : e.editor.getData()
        });
    }
    onSaveHandler = e => {
        let formData = {
            id:this.state.id,
            from : this.state.from,
            threadId:this.props.editValue.threadId,
            to:this.state.to,
            cc:this.state.cc,
            subject:this.state.subject,
            html:this.state.body,
            attachments:[]
        };
        // this.props.update_draft(formData);
        this.onClose();
    }
    onSendHandler = e => {
        let formData = {
            id:this.state.id,
            threadId:this.props.editValue.threadId,
            headers:this.props.editValue.payload.headers,
            from : this.state.from,
            to:this.state.to,
            cc:this.state.cc,
            subject:this.state.subject,
            html:this.state.body,
            attachments:[]
        };
        this.props.send_new_email(formData, null , "send=true");
        this.onClose();
    }
    onFileSelector = e => {
        let file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            let attachment = {
                "filename": file.name,
                "content":reader.result,
                "encoding":"base64"
            }
            let attachments = this.state.attachments;
            attachments.push(attachment);
            this.setState({ attachments:attachments })
          };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }
    localProps = {
        onModalToggler:this.onModalToggler,
        handleAddChip:this.handleAddChip,
        handleDeleteChip:this.handleDeleteChip,
        onChange:this.onChange,
        onEditorChangeHandler:this.onEditorChangeHandler,
        onFileSelector:this.onFileSelector,
        onSaveHandler:this.onSaveHandler,
        onSendHandler:this.onSendHandler
    }
    render() {
        return (
            <div>
                <WrapperComponent  { ...this.state } { ...this.localProps } showSave={true}>
                    <div className="email_create_main_container">
                        <div className="email_create_left_container">
                            <BasicEmail {...this.state} { ...this.localProps }/>
                            <Body body={ this.state.body } onChange={ this.onEditorChangeHandler }/>
                        </div>
                        <div className="email_create_right_container">
                            <AttachmentsLabels { ...this.localProps }/>
                        </div>
                    </div>
                </WrapperComponent>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    connectappAuth : state.connectapp.auth,
    connectappEmail : state.connectapp.email
})

export default connect( mapStateToProps, {
    send_new_email
} )( withRouter( CreateEmails ) );


export const BasicEmail = ( props ) => {
    return (
        <>
            <div className="form_group_row">
                <ChipInput label="To" fullWidth name="to" placeholder="Send email to ..." value={props.to} onAdd={(chip) => props.handleAddChip(chip,"to")} onDelete={(chip, index) => props.handleDeleteChip(chip, index, "to")} />
            </div>
            <div className="form_group_row">
                <ChipInput label="CC" fullWidth name="cc" placeholder="Send cc to ..." value={props.cc} onAdd={(chip) => props.handleAddChip(chip,"cc")} onDelete={(chip, index) => props.handleDeleteChip(chip, index, "cc")} />
            </div>
            <div className="form_group_row" style={{ height:"70px" }}>
                <TextInput name="subject" value={ props.subject } onChange={ props.onChange } placeholder="Email Subject here. . . " label="Subject" required={ true } />
            </div>
        </>
    )
}

export const AttachmentsLabels = ( props ) => {
    return (
        <>
            <div className="attachment_label_container">
                <div className="label_field">Add attachment's here</div>
                <div className="button_field">
                    <Button variant="contained" component="label">
                        Select files
                        <input type="file" onChange={ props.onFileSelector } style={{ display:"none" }}  />
                    </Button>
                </div>
            </div>
        </>
    )
}