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
        let message = this.props.editValue;
        let to = [];
        let cc = [];
        let subject = "";
        let body = "";
        to = message.toRecipients.map( data => data.emailAddress.address );
        cc = message.ccRecipients.map( data => data.emailAddress.address );
        subject = message.subject;
        body = message.body.content;
        this.setState({
            to:to,
            cc:cc,
            subject:subject,
            body:body,
        });
    }

    onClose = e => {
        this.props.onRemoveEditKey();
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
        let formData = {};
        if( this.props.type === "forward" ){
            formData = {
                id:this.props.editValue.id,
                "comment": this.state.body,
                ccRecipients:this.state.cc.map( data => ({ "emailAddress":{ "name":data, address:data }}) ),
                toRecipients:this.state.to.map( data => ({ "emailAddress":{ "name":data, address:data }}) )
            }
        } else if( this.props.type === "replyAll" ){
            formData = {
                id:this.props.editValue.id,
                "comment": this.state.body
            };
        } else if( this.props.type === "reply" ){
            formData = {
                id:this.props.editValue.id,
                "message":{  
                    ccRecipients:this.state.cc.map( data => ({ "emailAddress":{ "name":data, address:data }}) ),
                    toRecipients:this.state.to.map( data => ({ "emailAddress":{ "name":data, address:data }}) )
                },
                "comment": this.state.body
              }
        } else {

        }
        this.props.send_new_email(formData, null , `type=${this.props.type}`);
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
        console.log( this.state );
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