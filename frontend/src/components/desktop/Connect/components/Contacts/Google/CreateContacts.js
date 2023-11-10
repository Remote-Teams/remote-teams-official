import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { create_new_contacts } from '../../../store/actions/contactAction';
import WrapperComponent from './WrapperComponents';
import TextInput from '../ReusableComponent/TextInput';

export class CreateContacts extends Component {
    constructor(){
        super();
        this.state = {
            contactModal:false,
            givenName:"",
            familyName:"",
            emailAddress:[{value:"", type:""}],
            companyname:"",
            JobTitle:"",
            phoneNumbers:[{ value:"", type:"" }]

        }
    }
    onClose = e => {
        this.setState({
            contactModal:false,
            givenName:"",
            familyName:"",
            emailAddress:[{value:"", type:""}],
            companyname:"",
            JobTitle:"",
            phoneNumbers:[{ value:"", type:"" }]
        })
    }
    onModalToggler = value => e => {
        console.log( value );
        if( value === false ){
            this.setState({
                contactModal:false,
                givenName:"",
                familyName:"",
                emailAddress:[{value:"", type:""}],
                companyname:"",
                JobTitle:"",
                phoneNumbers:[{ value:"", type:"" }]
            })
        } else {
            this.setState({ contactModal: value });
        }
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
        let formData = {
            names:[{ 
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
        this.props.create_new_contacts( formData );
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
    create_new_contacts
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