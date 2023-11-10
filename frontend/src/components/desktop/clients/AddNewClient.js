import React, { Component } from "react";
import PageTitle from "../common/PageTitle";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import UploadImage from "../common/UploadImage";
import Toggle from "../common/Toggle";
// import UploadFile from "../common/UploadFile";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import InputFieldPhoneCountryNumber from "../common/InputFieldPhoneCountryNumber";
import { connect } from "react-redux";
import {
  addNewClient,
  inviteClient,
} from "./../../../store/actions/clientAction";
import { fileUpload } from "./../../../store/actions/resourcesAction";
import isEmpty from "../../../store/validations/is-empty";
import DatePickerFromToDate from "../common/DatePickerFromToDate";
import UploadMultipleFiles from "../common/UploadMultipleFiles";
import { validateAddClient } from "./../../../store/validations/clientValidation/ClientAddValidation";

class AddNewClient extends Component {
  constructor() {
    super();
    this.state = {
      clientName: "",
      isStatusActive: false,
      thumbnail: "",
      contactName: "",
      contactCountryCode: "+1",
      contactNumber: "",
      contactEmail: "",
      multipleContact: [],
      location: "",
      website: "",
      billingAddress1: "",
      shippingAddress1: "",
      billingAddress2: "",
      shippingAddress2: "",
      billingAddress3: "",
      shippingAddress3: "",
      startDate: "",
      endDate: "",
      fileName: [],
      fileData: [],
      shareInviteEmail: "",
      errors: {},
    };
  }

  /*=================================================================
      lifecycle methods
  =================================================================*/
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  /*=================================================================
      handlers
  =================================================================*/

  handleChange = (e) => {
    if (e.target.name === "clientName") {
      this.setState({
        contactName: e.target.value,
      });
    }
    this.setState({
      [e.target.name]: e.target.value,
      errors: {},
    });
  };

  handleChangeCountryCode = (val) => {
    console.log(val);
    this.setState({
      contactCountryCode: val,
    });
  };

  handleChangeNumber = (e) => {
    this.setState({
      [e.target.name]: e.target.validity.valid ? e.target.value : "",
    });
  };

  handleChangeMultiContactName = (index) => (e) => {
    let multipleContact = this.state.multipleContact;
    multipleContact[index].contactName = e.target.value;
    this.setState({ multipleContact });
  };

  handleChangeCountryCodeMultiContact = (value, index) => {
    let multipleContact = this.state.multipleContact;
    multipleContact[index].contactCountryCode = value;
    this.setState({ multipleContact });
  };

  handleChangeNumberMultiContact = (index) => (e) => {
    let multipleContact = this.state.multipleContact;
    multipleContact[index].contactNumber = e.target.validity.valid
      ? e.target.value
      : "";
    this.setState({ multipleContact });
  };

  handleChangeMultiContactEmail = (index) => (e) => {
    let multipleContact = this.state.multipleContact;
    multipleContact[index].contactEmail = e.target.value;
    this.setState({ multipleContact });
  };

  handleOnClickAddMoreContact = () => {
    let obj = {
      contactName: "",
      contactCountryCode: "+1",
      contactNumber: "",
      contactEmail: "",
    };
    let multipleContact = this.state.multipleContact;
    multipleContact.push(obj);
    this.setState({ multipleContact });
  };

  handleOnClickRemoveContact = (index) => (e) => {
    let multipleContact = this.state.multipleContact;
    multipleContact.splice(index, 1);
    this.setState({ multipleContact });
  };

  handleOnChangeToggle = (e) => {
    this.setState({
      [e.target.name]: e.target.checked,
    });
  };

  callBackFileUpload = (data) => {
    console.log(data);
    this.setState({
      coverImg: data.fileUrl,
    });
  };

  handleOnChangeUploadImg = (e) => {
    e.preventDefault();
    const data = new FormData();
    // data.append("image", e.target.files[0].name);
    data.append("file", e.target.files[0]);
    this.setState({
      thumbnail:
        e.target.files.length > 0
          ? URL.createObjectURL(e.target.files[0])
          : e.target.value,
    });
    this.props.fileUpload(data, this.callBackFileUpload);
  };

  handleChangeStart = (date) => {
    if (date === null) {
      this.setState({
        startDate: new Date(),
      });
    } else {
      this.setState({
        startDate: date,
      });
    }
  };

  handleChangeEnd = (date) => {
    if (date === null) {
      this.setState({
        endDate: new Date(),
      });
    } else {
      this.setState({
        endDate: date,
      });
    }
  };

  callBackAddClient = (status) => {
    if (status === 200 && this.state.isStatusActive === true) {
      const formData = {
        recipients: [
          {
            email: this.state.shareInviteEmail,
            firstName: this.state.clientName,
            lastName: "Company",
            profileImage: "",
            additionalInfo: {},
            memberType: "CLIENT",
            phone: "",
            location: "",
            timezone: "",
            contract: {
              start_date: "",
              end_date: "",
              working_hrs_to: "",
              working_hrs_from: "",
              ctc: "",
              attachments: this.state.fileData,
            },
            demo: false,
            role: this.props.clientRole._id,
            dateOfJoining: new Date().toISOString(),
            jobTitle: "Client",
          },
        ],
      };
      this.props.inviteClient(formData);
    }
  };

  handleOnClickSave = () => {
    // console.log(this.state);
    const { multipleContact } = this.state;

    const { errors, isValid } = validateAddClient(this.state);

    if (!isValid) {
      this.setState({
        errors: errors,
      });
    } else {
      let secondaryContactPerson =
        !isEmpty(multipleContact) &&
        multipleContact.map((contact) => ({
          name: contact.contactName,
          country_code: contact.contactCountryCode,
          phone: contact.contactNumber,
          email: contact.contactEmail,
        }));

      const formData = {
        name: this.state.clientName,
        status: "ACTIVE",
        defaultEmail: this.state.shareInviteEmail,
        primaryContactPerson: {
          name: this.state.clientName,
          country_code: this.state.contactCountryCode,
          phone: this.state.contactNumber,
          email: this.state.contactEmail,
        },
        secondaryContactPerson: secondaryContactPerson,
        location: this.state.location,
        website: this.state.website,
        addresses: {
          billing_line_one: this.state.billingAddress1,
          billing_line_two: this.state.billingAddress2,
          billing_line_three: this.state.billingAddress3,
          shipping_line_one: this.state.shippingAddress1,
          shipping_line_two: this.state.shippingAddress2,
          shipping_line_three: this.state.shippingAddress3,
        },
        contract: {
          start_date: this.state.startDate.toISOString(),
          end_date: this.state.endDate.toISOString(),
        },
        documents: this.state.fileData,
        coverImg: this.state.coverImg,
      };

      this.props.addNewClient(formData, this.callBackAddClient);
    }
  };

  /*=================================================================
      renderRow1
  =================================================================*/
  renderRow1 = () => {
    const { errors } = this.state;
    return (
      <div className="row mx-0 align-items-start mt-50">
        <div className="col-4">
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms1"
            //label="Client name"
            placeholder="Client name"
            name="clientName"
            value={this.state.clientName}
            onChange={this.handleChange}
            type="text"
            error={!isEmpty(errors.clientName) && errors.clientName}
          />
        </div>
        <div className="col-4">
          <h3 className="font-18-bold-space-light-uppercase mb-20">
            allow access to project
          </h3>
          <Toggle
            containerClassName="client-toggle-div"
            textClassName="client-card-subtittle-text client-card-subtittle-text--toggle"
            name="isStatusActive"
            text1={"Yes"}
            text2={"No"}
            onChange={this.handleOnChangeToggle}
            defaultChecked={this.state.isStatusActive}
          />
        </div>
        <div className="col-4">
          <UploadImage
            containerClassName="upload-img__mainBlock upload-img__mainBlock--new-client-img"
            //buttonName="+ Cover Image"
            buttonName="Upload Image"
            fileNameValue={this.state.thumbnail}
            acceptType="image/jpeg, image/png"
            onChange={this.handleOnChangeUploadImg}
          />
        </div>
      </div>
    );
  };

  /*=================================================================
      renderRow2
  =================================================================*/
  renderRow2 = () => {
    const { errors } = this.state;
    return (
      <div className="row mx-4 flex-nowrap">
        <div className="mr-50">
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms"
            //label="Primary contact name"
            placeholder="Primary contact name"
            name="contactName"
            value={this.state.contactName}
            onChange={this.handleChange}
            type="text"
            error={!isEmpty(errors.contactName) && errors.contactName}
          />
        </div>
        <div className="mr-50">
          <InputFieldPhoneCountryNumber
            containerClassName="container-login-flow-input container-login-flow-input--forms"
            //label="primary contact number"
            placeholder="primary contact number"
            name="contactNumber"
            value={this.state.contactNumber}
            countryCode={this.state.contactCountryCode}
            handleChangeCountryCode={this.handleChangeCountryCode}
            onChange={this.handleChangeNumber}
            errorCountryCode={""}
            errorPhone={!isEmpty(errors.contactNumber) && errors.contactNumber}
          />
        </div>
        <div className="mr-50">
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms"
            //label="primary contact email"
            placeholder="primary contact email"
            name="contactEmail"
            value={this.state.contactEmail}
            onChange={this.handleChange}
            type="email"
            error={!isEmpty(errors.contactEmail) && errors.contactEmail}
          />
        </div>
        <div>
          <div></div>
          {/*<GrayButtonSmallFont
            text="+ Point Of Contact"
            onClick={this.handleOnClickAddMoreContact}
          />*/}
          <button
            className="new-gradient-btn"
            onClick={this.handleOnClickAddMoreContact}
          >
            + Point Of Contact
          </button>
        </div>
      </div>
    );
  };

  /*=====================================================
             Invite Client for loign
  ======================================================*/
  renderInviteEmail = () => {
    return (
      <div className="row mx-4 flex-nowrap">
        <div className="mr-50">
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms"
            //label="Share invite with email address"
            placeholder="Share invite with email address"
            name="shareInviteEmail"
            value={this.state.shareInviteEmail}
            onChange={this.handleChange}
            type="text"
          />
        </div>
      </div>
    );
  };

  /*=================================================================
      renderRow2MultipleContact
  =================================================================*/
  renderRow2MultipleContact = () => {
    return (
      <>
        {this.state.multipleContact.map((data, index) => (
          <div key={index} className="row mx-4 flex-nowrap">
            <div className="mr-50">
              <InputFieldEmailTextPassword
                containerClassName="container-login-flow-input container-login-flow-input--forms"
                //label="contact name"
                placeholder="contact name"
                name="contactName"
                value={data.contactName}
                onChange={this.handleChangeMultiContactName(index)}
                type="text"
              />
            </div>
            <div className="mr-50">
              <InputFieldPhoneCountryNumber
                index={index}
                containerClassName="container-login-flow-input container-login-flow-input--forms"
                //label="contact number"
                placeholder="contact number"
                name="contactNumber"
                value={data.contactNumber}
                countryCode={data.contactCountryCode}
                handleChangeCountryCode={
                  this.handleChangeCountryCodeMultiContact
                }
                onChange={this.handleChangeNumberMultiContact(index)}
                errorCountryCode={""}
                errorPhone={""}
              />
            </div>
            <div className="mr-50">
              <InputFieldEmailTextPassword
                containerClassName="container-login-flow-input container-login-flow-input--forms"
                //label="contact email"
                placeholder="contact email"
                name="contactEmail"
                value={data.contactEmail}
                onChange={this.handleChangeMultiContactEmail(index)}
                type="email"
              />
            </div>
            <div>
              <i
                className="fa fa-times mult-contact-delete-icon"
                onClick={this.handleOnClickRemoveContact(index)}
              ></i>
            </div>
          </div>
        ))}
      </>
    );
  };

  /*=================================================================
      renderRow3
  =================================================================*/
  renderRow3 = () => {
    return (
      <div className="row mx-0">
        <div className="col-4">
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms"
            //label="Location"
            placeholder="Location"
            name="location"
            value={this.state.location}
            onChange={this.handleChange}
            type="text"
          />
        </div>
      </div>
    );
  };

  /*=================================================================
      renderRow4
  =================================================================*/
  renderRow4 = () => {
    return (
      <div className="row mx-0">
        <div className="col-4">
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms"
            //label="Website"
            placeholder="Website"
            name="website"
            value={this.state.website}
            onChange={this.handleChange}
            type="text"
          />
        </div>
      </div>
    );
  };

  /*=================================================================
      renderRow567
  =================================================================*/
  renderRow567 = () => {
    return (
      <>
        {/* 1 */}
        <div className="row mx-0">
          <div className="col-4">
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--forms"
              //label="billing address line 1"
              placeholder="billing address line 1"
              name="billingAddress1"
              value={this.state.billingAddress1}
              onChange={this.handleChange}
              type="text"
            />
          </div>
          <div className="col-4">
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--forms"
              //label="shipping address line 1"
              placeholder="shipping address line 1"
              name="shippingAddress1"
              value={this.state.shippingAddress1}
              onChange={this.handleChange}
              type="text"
            />
          </div>
        </div>
        {/* 2 */}
        <div className="row mx-0">
          <div className="col-4">
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--forms"
              //label="billing address line 2"
              placeholder="billing address line 2"
              name="billingAddress2"
              value={this.state.billingAddress2}
              onChange={this.handleChange}
              type="text"
            />
          </div>
          <div className="col-4">
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--forms"
              //label="shipping address line 2"
              placeholder="shipping address line 2"
              name="shippingAddress2"
              value={this.state.shippingAddress2}
              onChange={this.handleChange}
              type="text"
            />
          </div>
        </div>
        {/* 3 */}
        <div className="row mx-0">
          <div className="col-4">
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--forms"
              //label="billing address line 3"
              placeholder="billing address line 3"
              name="billingAddress3"
              value={this.state.billingAddress3}
              onChange={this.handleChange}
              type="text"
            />
          </div>
          <div className="col-4">
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--forms"
              //label="shipping address line 3"
              placeholder="shipping address line 3"
              name="shippingAddress3"
              value={this.state.shippingAddress3}
              onChange={this.handleChange}
              type="text"
            />
          </div>
        </div>
      </>
    );
  };

  /*=================================================================
      renderRow8
  =================================================================*/
  renderRow8 = () => {
    const { errors } = this.state;
    return (
      <div className="col-12">
        <DatePickerFromToDate
          //labelStart="Start date"
          startDateValue={this.state.startDate}
          //labelEnd="End date"
          endDateValue={this.state.endDate}
          handleChangeStart={this.handleChangeStart}
          handleChangeEnd={this.handleChangeEnd}
          placeholderStart="Start date"
          placeholderEnd="End date"
          error={errors}
        />
      </div>
    );
  };

  /*===========================================================================
        renderUploadMultipleFiles
  ============================================================================*/

  callBackFileUpload = (data) => {
    this.setState({
      fileData: [...this.state.fileData, data],
    });
  };

  handleOnChangeUploadDocuments = (e) => {
    e.preventDefault();
    // upload exact file to server
    const data = new FormData();
    data.append("file", e.target.files[0]);

    //display multiple file name in front end
    let files = this.state.fileName;
    files.push(e.target.files[0].name);
    this.setState({
      fileName: files,
    });

    this.props.fileUpload(data, this.callBackFileUpload);
  };

  handleOnClickRemoveDocument = (val) => (e) => {
    e.preventDefault();
    const { fileName, fileData } = this.state;
    const filteredItems = fileName.filter((item) => item !== val);
    const filteredFileData = fileData.filter(
      (item) => item.originalname !== val
    );
    this.setState({
      fileName: filteredItems,
      fileData: filteredFileData,
    });
  };

  renderUploadMultipleFiles = () => {
    return (
      <UploadMultipleFiles
        containerClassName="upload-img__mainBlock upload-img__mainBlock--new-client"
        buttonName="Choose files"
        //buttonName="+ New Doc"
        fileNameValue={this.state.fileName}
        // acceptType="image/jpeg, image/png"
        onChange={this.handleOnChangeUploadDocuments}
        handleOnClickRemoveDocument={this.handleOnClickRemoveDocument}
      />
    );
  };

  /*=================================================================
      renderRow9
  =================================================================*/
  renderRow9 = () => {
    return (
      <div className="row mx-0 pt-30">
        <div className="col-7 px-0">
          <h3 className="font-18-bold color-offwhite mb-20">
            Attach Document{" "}
            {/*<span className="text-lowercase">(if any)</span>*/}
          </h3>
          {this.renderUploadMultipleFiles()}
        </div>
      </div>
    );
  };

  /*=================================================================
      main
  =================================================================*/
  render() {
    // console.log(this.props.clientRole);
    return (
      <div className="login-member-day-offs">
        {/* page title */}
        <PageTitle title="Add client" />

        <div className="login-member-day-offs__content mt-50">
          <h2 className="font-29-bold">Profile</h2>
          {this.renderRow1()}
          {this.state.isStatusActive && this.renderInviteEmail()}
          {this.renderRow2()}

          {this.renderRow2MultipleContact()}
          {this.renderRow3()}
          <h2 className="font-29-bold mb-50">Work</h2>
          {this.renderRow4()}
          {this.renderRow567()}
          <h2 className="font-29-bold mb-50">Contract</h2>
          {this.renderRow8()}
          {this.renderRow9()}
          <div className="row mx-0 pt-20">
            <div className="col-12 pt-20">
              <GreenButtonSmallFont
                text="Save"
                onClick={this.handleOnClickSave}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  clientRole: state.auth.allRoles[3],
});

export default connect(mapStateToProps, {
  addNewClient,
  fileUpload,
  inviteClient,
})(AddNewClient);
