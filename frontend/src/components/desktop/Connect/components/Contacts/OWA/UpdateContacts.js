import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { update_contacts } from '../../../store/actions/contactAction';
import WrapperComponent from '../Google/WrapperComponents';
import TextInput from '../ReusableComponent/TextInput';

export class CreateContacts extends Component {
    constructor(){
        super();
        this.state = {
            contactModal:true,
            givenName:"",
            surname:"",
            companyName:"",
            mobilePhone:"",
            emailAddresses:[{name:"", address:""}],
            jobTitle:"",
            personalNotes:""
        }
    }
    componentDidMount(){
        let contact =  this.props.editValue ;
        this.setState({
            givenName : contact.givenName,
            surname   : contact.surname,
            companyName : contact.companyName,
            mobilePhone : contact.mobilePhone,
            emailAddresses : contact.emailAddresses[0] ? contact.emailAddresses :  [{name:"", address:""}],
            jobTitle : contact.jobTitle,
            personalNotes : contact.personalNotes
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
        let originalData = JSON.parse( JSON.stringify( this.props.editValue ));
        let formData = {
            ...originalData,
            ...this.state
        }
        if( formData.emailAddresses[0].address === "" ){
            delete formData.emailAddresses;
        }
        delete formData.contactModal;
        console.log( formData );
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
                        {/* <PhoneSection {...this.localProps} /> */}
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
                    <TextInput name="surname" value={ props.state.surname } onChange={ props.onChangeHandler } placeholder="Enter last Name" label="Last Name" required={ true }  />
                </div>
            </div>
            <div className="form_group_row">
                <div className="form_group_coloum">
                    <TextInput name="companyName" value={ props.state.companyName } onChange={ props.onChangeHandler } placeholder="Organisation name" label="Company name" required={ true }  />
                </div>
                <div className="form_group_coloum">
                    <TextInput name="jobTitle" value={ props.state.jobTitle } onChange={ props.onChangeHandler } placeholder="Enter job title" label="Job Title" required={ true }  />
                </div>
            </div>
            <div className="form_group_row">
                <TextInput name="mobilePhone" value={ props.state.mobilePhone } onChange={ props.onChangeHandler } placeholder="Enter mobile phone number" label="Mobile Number" required={ true } />
            </div>
            <div className="form_group_row"  style={{ height:"80px" }}>
                <TextInput name="personalNotes" value={ props.state.personalNotes } onChange={ props.onChangeHandler } placeholder="NOTES" label="Notes" required={ true } multiline={ true } rows={ 4 } />
            </div>
        </>
    )
}

export const EmailSection = ( props ) => {
    return (
        <>
        {
            props.state.emailAddresses.map( ( data, index ) => (
                <div key={ index } className="form_group_row">
                    <div className="form_group_coloum">
                        <TextInput name="address" value={ data.address } onChange={ props.onEmailSectionHandler("emailAddresses", index) } placeholder="Email Address" label="Email Address" />
                    </div>
                    <div className="form_group_coloum">
                        <TextInput name="name" value={ data.name } onChange={ props.onEmailSectionHandler("emailAddresses", index) } placeholder="Label" label="Label - ( work, home , others )" />
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