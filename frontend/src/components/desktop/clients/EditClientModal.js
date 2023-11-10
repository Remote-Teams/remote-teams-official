import React, { Component } from "react";
import Modal from "react-responsive-modal";
import Select from "react-select";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import InputFieldPhoneCountryNumber from "../common/InputFieldPhoneCountryNumber";
// import UploadFile from "../common/UploadFile";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import UploadImage from "../common/UploadImage";
import DatePickerFromToDate from "../common/DatePickerFromToDate";
import { connect } from "react-redux";
import { updateClientWithId } from "./../../../store/actions/clientAction";
import isEmpty from "../../../store/validations/is-empty";
import UploadMultipleFiles from "../common/UploadMultipleFiles";
import { fileUpload } from "./../../../store/actions/resourcesAction";
import { validateAddClient } from "./../../../store/validations/clientValidation/ClientAddValidation";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import {
  getAllFieldsValue,
  getAllCustomFieldsByEntity,
} from "./../../../store/actions/commandCenterAction";

const imgClientDemo = require("../../../assets/img/dummy/block-img-client-card.svg");
const options = [
  { value: "Profile", label: "Profile" },
  { value: "Work", label: "Work" },
  { value: "Contract", label: "Contract" },
];

const customOptions = [
  { value: "Custom Fields 1", label: "Custom Fields 1" },
  { value: "Custom Fields 2", label: "Custom Fields 2" },
  { value: "Custom Fields 3", label: "Custom Fields 3" },
];

class EditClientModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: options[0],
      //  renderTitleBlock
      thumbnail: "",
      clientName: "Client Name",
      //   renderProfileContent
      contactName: "",
      contactCountryCode: "+1",
      contactNumber: "",
      contactEmail: "",
      multipleContact: [],
      location: "",
      //   renderWorkContent
      website: "",
      billingAddress1: "",
      shippingAddress1: "",
      billingAddress2: "",
      shippingAddress2: "",
      billingAddress3: "",
      shippingAddress3: "",
      //   renderContractContent
      startDate: "",
      endDate: "",
      document: "",
      clientData: this.props.editCardData,
      fileName: [],
      fileData: [],
      //  renderCustomFields
      customFields: "",
      customFieldsSelected: "",
      customTextboxfieldData: {},
      customeDropdownFieldData: {
        // Dropdown: { value: "Facebook", label: "Facebook" },
      },
    };
  }

  componentDidMount() {
    const { clientData } = this.state;
    this.setState({
      contactName: clientData.primaryContactPerson.name,
      contactCountryCode: clientData.primaryContactPerson.country_code,
      contactEmail: clientData.primaryContactPerson.email,
      location: clientData.location,
      contactNumber: clientData.primaryContactPerson.phone,
      website: clientData.website,
      billingAddress1: clientData.addresses.billing_line_one,
      billingAddress2: clientData.addresses.billing_line_two,
      billingAddress3: clientData.addresses.billing_line_three,
      shippingAddress1: clientData.addresses.shipping_line_one,
      shippingAddress2: clientData.addresses.shipping_line_two,
      shippingAddress3: clientData.addresses.shipping_line_three,
      startDate: new Date(clientData.contract.start_date),
      endDate: new Date(clientData.contract.end_date),
      clientName: clientData.name,
      thumbnail: clientData.coverImg,
      fileName: isEmpty(clientData.documents)
        ? []
        : clientData.documents.map((doc) => doc.originalname),
      fileData: isEmpty(clientData.documents) ? [] : clientData.documents,
    });
    this.props.getAllFieldsValue({
      entity_Id: clientData._id,
    });

    // this.props.getAllCustomFieldsByEntity("CLIENT");
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (!isEmpty(nextProps.allFieldsValue) && !nextState.hasSet) {
      let textDataFinalObject = {};
      let dropdownDataFinalObject = {};
      nextProps.allFieldsValue.forEach((ele) => {
        console.log(ele);
        if (ele.fieldData.type === "TEXTBOX") {
          ele.fieldData.name = ele.fieldData.name.split(" ").join("");
          textDataFinalObject[ele.fieldData.name] = ele.value;
        } else {
          ele.fieldData.name = ele.fieldData.name.split(" ").join("");
          dropdownDataFinalObject[ele.fieldData.name] = {
            value: ele.value,
            label: ele.value,
          };
        }
      });
      return {
        clientCustomFields: nextProps.allFieldsValue,
        customTextboxfieldData: textDataFinalObject,
        customeDropdownFieldData: dropdownDataFinalObject,
        hasSet: true,
      };
    }
    return null;
  }

  /*============================================================
      handlers
  ============================================================*/

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleDropdownChange = (selectedOption) => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  handleCustomeDropdownChange = (selectedOption) => {
    this.setState({ customFieldsSelected: selectedOption });
    console.log(`Option selected:`, selectedOption);
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

  handleOnChangeUploadImg = (e) => {
    e.preventDefault();
    //this.setState({
    //  thumbnail:
    //    e.target.files.length > 0
    //      ? URL.createObjectURL(e.target.files[0])
    //      : e.target.value,
    //});
    const data = new FormData();
    // data.append("image", e.target.files[0].name);
    data.append("file", e.target.files[0]);
    this.setState({
      thumbnail:
        e.target.files.length > 0
          ? URL.createObjectURL(e.target.files[0])
          : e.target.value,
    });
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

  handleOnChangeAttachDoc = (e) => {
    e.preventDefault();
    this.setState({
      document:
        e.target.files.length > 0 ? e.target.files[0].name : e.target.value,
    });
  };

  callBackUpdate = () => {
    console.log("sd");
    this.props.onCloseModal();
  };

  handleOnClickSave = () => {
    console.log(this.state);
    const { clientData } = this.state;
    const {
      customTextboxfieldData,
      customeDropdownFieldData,
      clientCustomFields,
    } = this.state;
    let previousData = clientData;

    // const { errors, isValid } = validateAddClient(this.state);

    // if (!isValid) {
    //   this.setState({
    //     errors: errors,
    //   });
    // } else {
    previousData.name = this.state.clientName;
    previousData.primaryContactPerson.name = this.state.contactName;
    previousData.primaryContactPerson.country_code = this.state.contactCountryCode;
    previousData.primaryContactPerson.phone = this.state.contactNumber;
    previousData.primaryContactPerson.email = this.state.contactEmail;
    previousData.website = this.state.website;
    previousData.addresses.billing_line_one = this.state.billingAddress1;
    previousData.addresses.billing_line_two = this.state.billingAddress2;
    previousData.addresses.billing_line_three = this.state.billingAddress3;
    previousData.addresses.shipping_line_one = this.state.shippingAddress1;
    previousData.addresses.shipping_line_two = this.state.shippingAddress2;
    previousData.addresses.shipping_line_three = this.state.shippingAddress3;
    previousData.defaultEmail = this.state.contactEmail;
    previousData.location = this.state.location;
    previousData.contract.start_date = this.state.startDate.toISOString();
    previousData.contract.end_date = this.state.endDate.toISOString();
    previousData.coverImg = this.state.thumbnail;
    previousData.documents = this.state.fileData;
    this.props.updateClientWithId(
      previousData._id,
      previousData,
      customTextboxfieldData,
      customeDropdownFieldData,
      clientCustomFields,
      this.callBackUpdate
    );
    // }

    // this.props.onCloseModal();
  };

  /*==================================================
            CUSTOM FIELD SECTION START
  ====================================================*/

  // CUSTOM TEXTBOX SECTION

  handleChangeCustomTextBox = (name) => (e) => {
    let prevFieldData = this.state.customTextboxfieldData;
    prevFieldData[name] = e.target.value;
    this.setState({
      customTextboxfieldData: prevFieldData,
    });
  };

  renderCustomTextbox = (fieldData) => {
    // console.log(fieldData);
    let name = fieldData.fieldData.name.split(" ").join("");
    return (
      <>
        <h3 className="font-18-bold color-offwhite">
          {fieldData.fieldData.name}
        </h3>
        <InputFieldEmailTextPassword
          containerClassName="container-login-flow-input container-login-flow-input--forms"
          label={`${fieldData.fieldData.name}`}
          placeholder={`${fieldData.fieldData.name}`}
          name="billingAddress3"
          value={this.state.customTextboxfieldData[name]}
          onChange={this.handleChangeCustomTextBox(name)}
          type="text"
        />
      </>
    );
  };

  // CUSTOM DROPDOWN SECTION

  onCustomDropdownChange = (name) => (e) => {
    let prevFieldData = this.state.customeDropdownFieldData;
    prevFieldData[name] = { value: e.value, label: e.value };
    this.setState({
      customeDropdownFieldData: prevFieldData,
    });
    // console.log("Selected: " + e.value, name);
  };

  renderCustomDropdown = (fieldData) => {
    // console.log(fieldData);
    let name = fieldData.fieldData.name.split(" ").join("");
    let dropdownOption = [];
    fieldData.fieldData.options.forEach((element) => {
      let obj = { value: element, label: element };
      dropdownOption.push(obj);
    });
    return (
      <div className="col-5">
        <h3 className="font-18-bold color-offwhite">
          {" "}
          {fieldData.fieldData.name}
        </h3>
        <Select
          isSearchable={false}
          className="react-select-container react-select-container--addMember mt-20"
          classNamePrefix="react-select-elements"
          value={this.state.customeDropdownFieldData[name]}
          onChange={this.onCustomDropdownChange(name)}
          options={dropdownOption}
          placeholder="Select"
        />
      </div>
    );
  };

  /*==================================================
            CUSTOM FIELD SECTION END
  ====================================================*/

  /*============================================================
      renderTitleBlock
  ============================================================*/
  renderTitleBlock = () => {
    const btnName = <i className="fa fa-pencil" />;
    return (
      <div className="row mx-0 mb-15">
        <div>
          <UploadImage
            containerClassName="upload-img__mainBlock upload-img__mainBlock--editModal upload-img__mainBlock--new-client-img"
            buttonName={btnName}
            thumbnailValue={this.state.thumbnail}
            acceptType="image/jpeg, image/png"
            onChange={this.handleOnChangeUploadImg}
            fileNameValue={this.state.thumbnail}
          />
        </div>

        <div>
          {/*<InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms container-login-flow-input--editModal"
            label=""
            name="clientName"
            value={this.state.clientName}
            onChange={this.handleChange}
            type="text"
          />*/}
          <h3 className="new-client-name-display">{this.state.clientName}</h3>
        </div>
      </div>
    );
  };

  /*============================================================
      renderProfileContent
  ============================================================*/
  renderProfileContent = () => {
    return (
      <div className="row mx-0">
        <div className="col-7 pl-0">
          <h5 className="font-18-bold color-offwhite">Primary Contact Name</h5>
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms mt-20"
            //label="Primary contact name"
            name="contactName"
            value={this.state.contactName}
            onChange={this.handleChange}
            type="text"
            placeholder={"Primary contact name"}
          />
        </div>
        <div className="col-5">
          <h5 className="font-18-bold color-offwhite">Primary Contact Email</h5>
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms mt-20"
            //label="primary contact email"
            name="contactEmail"
            value={this.state.contactEmail}
            onChange={this.handleChange}
            type="email"
            placeholder={"primary contact email"}
          />
        </div>
        <div className="col-7 pl-0">
          <div className="container-login-flow-input--forms--display-clients">
            <h5 className="font-18-bold color-offwhite">
              Primary Contact Number
            </h5>
            <InputFieldPhoneCountryNumber
              containerClassName="container-login-flow-input container-login-flow-input--forms mt-20"
              //label="primary contact number"
              name="contactNumber"
              value={this.state.contactNumber}
              countryCode={this.state.contactCountryCode}
              handleChangeCountryCode={this.handleChangeCountryCode}
              onChange={this.handleChangeNumber}
              errorCountryCode={""}
              errorPhone={""}
              placeholder={"primary contact number"}
            />
          </div>
        </div>
        <div className="col-5">
          <h5 className="font-18-bold color-offwhite">Location</h5>
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms mt-20"
            //label="Location"
            name="location"
            value={this.state.location}
            onChange={this.handleChange}
            type="text"
            placeholder={"location"}
          />
        </div>
      </div>
    );
  };

  /*=================================================================
      renderWorkContent
  =================================================================*/
  renderWorkContent = () => {
    return (
      <>
        <div className="row mx-0">
          <div className="col-5 pl-0">
            {/*<h3 className="font-18-bold add-new-client-work-details-text mt-0">
              Work Details
    </h3>*/}
            <div>
              <h5 className="font-18-bold color-offwhite">Website</h5>
              <InputFieldEmailTextPassword
                containerClassName="container-login-flow-input container-login-flow-input--forms mt-20"
                //label="Website"
                name="website"
                value={this.state.website}
                onChange={this.handleChange}
                type="text"
                placeholder={"website"}
              />
            </div>
          </div>
        </div>
        {/* 1 */}
        <div className="row mx-0">
          <div className="col-5 pl-0">
            <h3 className="font-18-bold color-offwhite">Billing Address</h3>
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--forms mt-20"
              //label="billing address line 1"
              name="billingAddress1"
              value={this.state.billingAddress1}
              onChange={this.handleChange}
              type="text"
              placeholder={"billing address line 1"}
            />
          </div>
          <div className="col-5">
            <h3 className="font-18-bold color-offwhite">Shipping Address</h3>
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--forms mt-20"
              //label="shipping address line 1"
              name="shippingAddress1"
              value={this.state.shippingAddress1}
              onChange={this.handleChange}
              type="text"
              placeholder={"shipping address line 1"}
            />
          </div>
        </div>
        {/* 2 */}
        <div className="row mx-0">
          <div className="col-5 pl-0">
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--forms"
              //label="billing address line 2"
              name="billingAddress2"
              value={this.state.billingAddress2}
              onChange={this.handleChange}
              type="text"
              placeholder={"billing address line 2"}
            />
          </div>
          <div className="col-5">
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--forms"
              //label="shipping address line 2"
              name="shippingAddress2"
              value={this.state.shippingAddress2}
              onChange={this.handleChange}
              type="text"
              placeholder={"shipping address line 2"}
            />
          </div>
        </div>
        {/* 3 */}
        <div className="row mx-0">
          <div className="col-5 pl-0">
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--forms"
              //label="billing address line 3"
              name="billingAddress3"
              value={this.state.billingAddress3}
              onChange={this.handleChange}
              type="text"
              placeholder={"billing address line 3"}
            />
          </div>
          <div className="col-5">
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--forms"
              //label="shipping address line 3"
              name="shippingAddress3"
              value={this.state.shippingAddress3}
              onChange={this.handleChange}
              type="text"
              placeholder={"shipping address line 3"}
            />
          </div>
        </div>
      </>
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
        buttonName="+ New Doc"
        fileNameValue={this.state.fileName}
        // acceptType="image/jpeg, image/png"
        onChange={this.handleOnChangeUploadDocuments}
        handleOnClickRemoveDocument={this.handleOnClickRemoveDocument}
      />
    );
  };

  /*=================================================================
      renderContractContent
  =================================================================*/
  renderContractContent = () => {
    const { errors } = this.state;
    return (
      <>
        <div className="row mx-0">
          <div className="col-12 pl-0">
            <div className="row mx-0">
              <div className="col-6 pl-0">
                <h3 className="font-18-bold color-offwhite">
                  Contract Start Date
                </h3>
              </div>
              <div className="col-5 ">
                <h3 className="font-18-bold color-offwhite">
                  Contract End Date
                </h3>
              </div>
            </div>
            <div className="mt-20">
              <DatePickerFromToDate
                //labelStart="Start date"
                startDateValue={this.state.startDate}
                //labelEnd="End date"
                endDateValue={this.state.endDate}
                handleChangeStart={this.handleChangeStart}
                handleChangeEnd={this.handleChangeEnd}
                readOnly={true}
                error={errors}
                placeholderEnd={"End Date"}
                placeholderStart={"Start Date"}
              />
            </div>
          </div>
          <div className="col-10 pl-0">
            <h3 className="font-18-bold color-offwhite mb-20">
              {/*Attach*/} Document{" "}
              {/*<span className="text-lowercase">(if any)</span>*/}
            </h3>
            {this.renderUploadMultipleFiles()}
          </div>
        </div>
      </>
    );
  };

  /*============================================================
                         Custom Fields
  ============================================================*/
  renderCustomFieldsContent = () => {
    const { clientCustomFields } = this.state;
    if (!isEmpty(clientCustomFields)) {
      return clientCustomFields.map((data, index) => {
        if (data.fieldData.type === "TEXTBOX") {
          return (
            <div key={index} className="mt-5">
              {this.renderCustomTextbox(data)}
            </div>
          );
        } else {
          return (
            <div key={index} className="mt-5">
              {this.renderCustomDropdown(data)}
            </div>
          );
        }
      });
    }

    // return (
    //   <>
    //     <div className="row mx-0 align-items-start ">
    //       <div className="col-5 pl-0">
    //         <h3 className="font-18-bold color-offwhite">Custom Fields</h3>
    //         <InputFieldEmailTextPassword
    //           containerClassName="container-login-flow-input container-login-flow-input--forms mt-20"
    //           //label="shipping address line 3"
    //           name="customFields"
    //           value={this.state.customFields}
    //           onChange={this.handleChange}
    //           type="text"
    //           placeholder={"Custom Fields"}
    //         />
    //       </div>
    //       <div className="col-5">
    //         <h3 className="font-18-bold color-offwhite">Custom Fields 2</h3>
    //         <Select
    //           isSearchable={false}
    //           className="react-select-container react-select-container--addMember mt-20"
    //           classNamePrefix="react-select-elements"
    //           value={this.state.customFieldsSelected}
    //           onChange={this.handleCustomeDropdownChange}
    //           options={customOptions}
    //           placeholder="Select"
    //         />
    //       </div>
    //     </div>
    //   </>
    // );
  };
  /*============================================================
      main
  ============================================================*/
  render() {
    const { editCardData, isEditModalOpen, onCloseModal } = this.props;
    const { selectedOption, clientCustomFields } = this.state;
    // console.log(this.state.clientCustomFields);
    return (
      <div>
        <Modal
          open={isEditModalOpen}
          onClose={onCloseModal}
          closeOnEsc={false}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal:
              "customModal customModal--clientEditModal customModal--clientEditModal--new",
            closeButton: "customCloseButton",
          }}
        >
          {/* close modal */}
          <span className="closeIconInModal" onClick={onCloseModal} />
          {/* content */}
          <div className="edit-client-modal-content">
            {this.renderTitleBlock()}
            {/*<div className="mb-50">
              <Select
                isSearchable={false}
                className="react-select-container"
                classNamePrefix="react-select-elements"
                value={selectedOption}
                onChange={this.handleDropdownChange}
                options={options}
                placeholder="Select"
              />
        </div>*/}
            {/*selectedOption.value === "Profile" && (
              <>
                <div className="edit-client-work-overflow-div">
                  {this.renderProfileContent()}
                </div>
              </>
            )}
            {selectedOption.value === "Work" && (
              <>
                <div className="edit-client-work-overflow-div">
                  {this.renderWorkContent()}
                </div>
              </>
            )}
            {selectedOption.value === "Contract" && (
              <>
                <div className="edit-client-work-overflow-div">
                  {this.renderContractContent()}
                </div>
              </>
            )*/}
            <div className="profile_tabs_section mt-10 profile_tabs_section--member-details-new">
              <Tabs>
                <TabList>
                  <Tab>Profile</Tab>
                  <Tab>Work</Tab>
                  <Tab>Contract</Tab>
                  {!isEmpty(clientCustomFields) && <Tab>Custom Fields</Tab>}
                </TabList>

                <TabPanel>
                  <div className="edit-client-work-overflow-div">
                    {this.renderProfileContent()}
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="edit-client-work-overflow-div">
                    {this.renderWorkContent()}
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="edit-client-work-overflow-div">
                    {this.renderContractContent()}
                  </div>
                </TabPanel>
                {!isEmpty(clientCustomFields) && (
                  <TabPanel>
                    <div className="edit-client-work-overflow-div">
                      {this.renderCustomFieldsContent()}
                    </div>
                  </TabPanel>
                )}
              </Tabs>
            </div>
            <div className="row mx-0">
              <div className="col-12 text-right">
                <GreenButtonSmallFont
                  text="Save Changes"
                  onClick={this.handleOnClickSave}
                  extraClassName="client-edit-save-btn"
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  allFieldsValue: state.commandCenter.allFieldsValue,
});

export default connect(mapStateToProps, {
  fileUpload,
  updateClientWithId,
  getAllFieldsValue,
  getAllCustomFieldsByEntity,
})(EditClientModal);
