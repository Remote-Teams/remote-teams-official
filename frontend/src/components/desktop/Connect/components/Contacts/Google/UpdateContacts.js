import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { update_contacts } from '../../../store/actions/contactAction';
import WrapperComponent from './WrapperComponents';
import TextInput from '../ReusableComponent/TextInput';

export class CreateContacts extends Component {
    constructor(){
        super();
        this.state = {
            contactModal:true,
            givenName:"",
            familyName:"",
            emailAddress:[{value:"", type:""}],
            companyname:"",
            JobTitle:"",
            phoneNumbers:[{ value:"", type:"" }]

        }
    }
    componentDidMount(){
        let contact =  this.props.editValue ;
        this.setState({
            givenName:contact.names ? contact.names[0].givenName : "",
            familyName:contact.names ? contact.names[0].familyName : "",
            emailAddress:contact.emailAddresses ? contact.emailAddresses :[{value:"", type:""}],
            companyname: contact.organizations ? contact.organizations[0].name : "",
            JobTitle: contact.organizations ? contact.organizations[0].title : "",
            phoneNumbers:contact.phoneNumbers ? contact.phoneNumbers : [{ value:"", type:"" }]
        })
    }
    onClose = e => {
        this.props.onRemoveEditKey();
    }
    onModalToggler = value => e => {
        this.onClose();
    }
    onChangeHandler = e => {
        this.setState({
            [e.target.name]:e.target.value
        })
    }
    onEmailSectionHandler = ( name, index ) => e => {
        let data = this.state[name];
        data[index][e.target.name] = e.target.value;
        this.setState({ 
            [name]:data
         });
    }
    onSaveHandler = e => {
        let formData = JSON.parse(JSON.stringify( this.props.editValue ));
        formData = {
            "resourceName":formData.resourceName,
            ...formData,
            names:[{ 
                ...formData.names[0],
                givenName:this.state.givenName,
                familyName:this.state.familyName
             }],
             emailAddresses:this.state.emailAddress,
             phoneNumbers:this.state.phoneNumbers,
             organizations:[{
                title:this.state.JobTitle,
                name:this.state.companyname
             }],
        };
        this.onClose();
        this.props.update_contacts( formData );
    }
    localProps = {
        onModalToggler:this.onModalToggler,
        onSaveHandler:this.onSaveHandler,
        onEmailSectionHandler:this.onEmailSectionHandler,
        onChangeHandler:this.onChangeHandler
    }
    render() {
        this.localProps.state = this.state;
        return (
            <div>
                <WrapperComponent { ...this.localProps }>
                    <div className="form_group_main_container">
                        <ProfileInformation { ...this.localProps }/>
                        <EmailSection {...this.localProps} />
                        <PhoneSection {...this.localProps} />
                    </div>
                </WrapperComponent>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    connectappAuth : state.connectapp.auth,
    connectappContact : state.connectapp.contact
});

export default connect( mapStateToProps, {
    update_contacts
})( withRouter( CreateContacts ) );


export const ProfileInformation = ( props ) => {
    return (
        <>
            <div className="form_group_row">
                <div className="form_group_coloum">
                    <TextInput name="givenName" value={ props.state.givenName } onChange={ props.onChangeHandler } placeholder="Enter first Name" label="First Name" required={ true } />
                </div>
                <div className="form_group_coloum">
                    <TextInput name="familyName" value={ props.state.familyName } onChange={ props.onChangeHandler } placeholder="Enter last Name" label="Last Name" required={ true }  />
                </div>
            </div>
            <div className="form_group_row">
                <div className="form_group_coloum">
                    <TextInput name="companyname" value={ props.state.companyname } onChange={ props.onChangeHandler } placeholder="Organisation name" label="Company name" required={ true }  />
                </div>
                <div className="form_group_coloum">
                    <TextInput name="JobTitle" value={ props.state.JobTitle } onChange={ props.onChangeHandler } placeholder="Enter job title" label="Job Title" required={ true }  />
                </div>
            </div>
        </>
    )
}

export const EmailSection = ( props ) => {
    return (
        <>
        {
            props.state.emailAddress.map( ( data, index ) => (
                <div key={ index } className="form_group_row">
                    <div className="form_group_coloum">
                        <TextInput name="value" value={ data.value } onChange={ props.onEmailSectionHandler("emailAddress", index) } placeholder="Email Address" label="Email Address" />
                    </div>
                    <div className="form_group_coloum">
                        <TextInput name="type" value={ data.type } onChange={ props.onEmailSectionHandler("emailAddress", index) } placeholder="Label" label="Label - ( work, home , others )" />
                    </div>
                </div>       
            ) )
        }
        </>
    )
}

export const PhoneSection = ( props ) => {
    return (
        <>
        {
            props.state.phoneNumbers.map( ( data, index ) => (
                <div key={ index } className="form_group_row">
                    <div className="form_group_coloum">
                        <TextInput name="value" value={ data.value } onChange={ props.onEmailSectionHandler("phoneNumbers", index) } placeholder="Mobile Phone number" label="Phone" />
                    </div>
                    <div className="form_group_coloum">
                        <TextInput name="type" value={ data.type } onChange={ props.onEmailSectionHandler("phoneNumbers", index) } placeholder="Label" label="Label - ( work, home , others )" />
                    </div>
                </div>       
            ) )
        }
        </>
    )
}