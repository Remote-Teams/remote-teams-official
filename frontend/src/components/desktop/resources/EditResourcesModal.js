import React, { Component } from "react";
import { setHours, setMinutes } from "date-fns";
// import Checkbox from "rc-checkbox";
// import "rc-checkbox/assets/index.css";
import Modal from "react-responsive-modal";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import InputFieldPhoneCountryNumber from "../common/InputFieldPhoneCountryNumber";
// import UploadFile from "../common/UploadFile";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import UploadImage from "../common/UploadImage";
import InputFieldNumber from "../common/InputFieldNumber";
import DatePickerFromToDate from "../common/DatePickerFromToDate";
import DatepickerFromToTime from "../common/DatePickerFromToTime";
import { connect } from "react-redux";
import { updateResourceAction } from "./../../../store/actions/resourcesAction";
import isEmpty from "../../../store/validations/is-empty";
import UploadMultipleFiles from "../common/UploadMultipleFiles";
import { fileUpload } from "./../../../store/actions/resourcesAction";

//const imgResourceDemo = require("../../../assets/img/dummy/resource-without-border.svg");
//const imgResourceDemo = require("../../../assets/img/dummy/new-profile-placeholder-with-border.svg");

const options = [
  { value: "Profile", label: "Profile" },
  { value: "Work", label: "Work" },
];

const memberTypeOptions = [
  { value: "Full Time Member", label: "Full Time Member" },
  { value: "Freelancer", label: "Freelancer" },
  { value: "Contract Member", label: "Contract Member" },
];

class EditResourcesModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: options[0],
      //  renderTitleBlock
      //profileImagefileName: imgResourceDemo,
      profileImagefileName: "",
      fname: "First Name",
      lname: "Last Name",
      emailAddress: "email@gmail.com",
      //   renderProfileContent
      dateOfBirth: new Date(),
      location: "",
      countryCode: "+1",
      phoneNumber: "",
      //   renderWorkContent
      memberTypeSelected: memberTypeOptions[0],
      startDate: new Date(),
      endDate: new Date(),
      fromTime: setHours(setMinutes(new Date(), 0), 9),
      toTime: setHours(setMinutes(new Date(), 0), 19),
      checkboxHours: false,
      cost: "",
      editCardData: this.props.editCardData,
      fileName: [],
      fileData: [],
    };
  }

  /*============================================
                Lifecycel Methods
  =============================================*/
  componentDidMount() {
    const { editCardData } = this.state;
    console.log(editCardData);
    this.setState({
      fname: editCardData.firstName,
      lname: editCardData.lastName,
      emailAddress: editCardData.email,
      // dateOfBirth: new Date(editCardData.additionalInfo.dateOfBirth),
      location: editCardData.location,
      phoneNumber: editCardData.phone,
      cost: editCardData.contract.ctc,
      fromTime: new Date(editCardData.contract.working_hrs_from),
      toTime: new Date(editCardData.contract.working_hrs_to),
      memberTypeSelected:
        editCardData.memberType === "FREELANCER"
          ? memberTypeOptions[1]
          : editCardData.memberType === "CONTRACTUAL"
          ? memberTypeOptions[2]
          : memberTypeOptions[0],

      fileName: isEmpty(editCardData.contract.attachments)
        ? []
        : editCardData.contract.attachments.map((doc) => doc.originalname),
      fileData: isEmpty(editCardData.contract.attachments)
        ? []
        : editCardData.contract.attachments,
    });
  }

  /*============================================================
      handlers
  ============================================================*/

  handleOnChangeUploadProfileImg = (e) => {
    e.preventDefault();
    this.setState({
      profileImagefileName:
        e.target.files.length > 0
          ? URL.createObjectURL(e.target.files[0])
          : e.target.value,
    });
  };

  handleDropdownChange = (selectedOption) => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleChangeSelectRole = (selectedOption) => {
    this.setState({ accessRole: selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  handleChangeSelectMemberType = (selectedOption) => {
    this.setState({ memberTypeSelected: selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  handleChangeCountryCode = (val) => {
    console.log(val);
    this.setState({
      countryCode: val,
    });
  };

  handleChangeNumber = (e) => {
    this.setState({
      [e.target.name]: e.target.validity.valid ? e.target.value : "",
    });
  };

  handleChangeDate = (date) => {
    if (date === null) {
      this.setState({
        dateOfBirth: new Date(),
      });
    } else {
      this.setState({
        dateOfBirth: date,
      });
    }
  };

  handleOnClickAdditionalInfoBtn = () => {
    this.setState({ isAdditionalInfo: !this.state.isAdditionalInfo });
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

  handleChangeFromTime = (time) => {
    if (time === null) {
      this.setState({
        fromTime: new Date(),
      });
    } else {
      this.setState({
        fromTime: time,
      });
    }
  };

  handleChangeToTime = (time) => {
    if (time === null) {
      this.setState({
        toTime: new Date(),
      });
    } else {
      this.setState({
        toTime: time,
      });
    }
  };

  // handleCheckboxChange = (e) => {
  //   this.setState({
  //     [e.target.id]: e.target.checked,
  //   });
  // };

  callBackUpdateResource = () => {
    this.props.onCloseModal();
  };

  handleOnClickSave = () => {
    console.log(this.state);
    const { editCardData } = this.state;
    let formData = editCardData;
    formData.firstName = this.state.fname;
    formData.lastName = this.state.lname;
    formData.lastName = this.state.lname;
    formData.email = this.state.emailAddress;
    formData.location = this.state.location;
    formData.phone = this.state.phoneNumber;
    formData.additionalInfo.country_code = this.state.countryCode;
    formData.additionalInfo.country_code = this.state.countryCode;
    formData.additionalInfo.dateOfBirth = this.state.dateOfBirth.toISOString();
    formData.contract.ctc = this.state.cost;
    formData.contract.working_hrs_from = this.state.fromTime.toISOString();
    formData.contract.working_hrs_to = this.state.toTime.toISOString();
    formData.contract.start_date = this.state.startDate.toISOString();
    formData.contract.end_date = this.state.endDate.toISOString();
    formData.memberType =
      this.state.memberTypeSelected.value === "Freelancer"
        ? "FREELANCER"
        : this.state.memberTypeSelected.value === "Full Time Member"
        ? "FULLTIME"
        : "CONTRACTUAL";
    formData.contract.attachments = this.state.fileData;
    this.props.updateResourceAction(
      formData._id,
      formData,
      this.callBackUpdateResource
    );
  };

  /*============================================================
      renderTitleBlock
  ============================================================*/
  renderTitleBlock = () => {
    const btnName = <i className="fa fa-pencil" />;
    return (
      <div className="row mx-0 flex-nowrap mb-15">
        <div>
          <UploadImage
            containerClassName="upload-img__mainBlock upload-img__mainBlock--editModal upload-img__mainBlock--new-client-img"
            buttonName={btnName}
            fileNameValue={this.state.profileImagefileName}
            acceptType="image/jpeg, image/png"
            onChange={this.handleOnChangeUploadProfileImg}
          />
        </div>

        <div>
          <div className="row mx-0">
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--forms container-login-flow-input--editResource"
              label=""
              name="fname"
              value={this.state.fname}
              onChange={this.handleChange}
              type="text"
            />
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--forms container-login-flow-input--editResource"
              label=""
              name="lname"
              value={this.state.lname}
              onChange={this.handleChange}
              type="text"
            />
          </div>
          <div>
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--forms container-login-flow-input--editResourceEmail"
              label=""
              name="emailAddress"
              value={this.state.emailAddress}
              onChange={this.handleChange}
              type="email"
            />
          </div>
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
        <div className="col-5 pl-0">
          <h3 className="font-18-bold color-offwhite">Date of Birth</h3>
          {/*<h3 className="font-18-bold-space-light-uppercase mb-20">
            date of birth
    </h3>*/}
          <div className="date-picker-common mt-30">
            <DatePicker
              minDate={new Date()}
              selected={this.state.dateOfBirth}
              onChange={this.handleChangeDate}
              placeholderText="date of birth"
            />
          </div>
        </div>
        <div className="col-6">
          <h3 className="font-18-bold color-offwhite">Location</h3>
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms mt-30"
            //label="Location"
            placeholder="Location"
            name="location"
            value={this.state.location}
            onChange={this.handleChange}
            type="text"
          />
        </div>
        <div className="col-12 pl-0">
          <h3 className="font-18-bold color-offwhite">Phone Number</h3>
          <InputFieldPhoneCountryNumber
            containerClassName="container-login-flow-input container-login-flow-input--add-new-client-pnumber container-login-flow-input--forms mt-30"
            //label="contact number"
            placeholder="contact number"
            name="phoneNumber"
            value={this.state.phoneNumber}
            countryCode={this.state.countryCode}
            handleChangeCountryCode={this.handleChangeCountryCode}
            onChange={this.handleChangeNumber}
            errorCountryCode={""}
            errorPhone={""}
          />
        </div>
      </div>
    );
  };

  /*=================================================================
      renderMemberTypeRow
  =================================================================*/
  renderMemberTypeRow = () => {
    return (
      <div className="row mx-0">
        <div className="col-5 mb-30 pl-0">
          <h3 className="font-18-bold color-offwhite">Member Type</h3>
          {/*<h3 className="font-18-bold-space-light-uppercase mb-20">
            Member type
    </h3>*/}
          <Select
            className="react-select-container react-select-container--addMember mt-50"
            classNamePrefix="react-select-elements"
            value={this.state.memberTypeSelected}
            onChange={this.handleChangeSelectMemberType}
            options={memberTypeOptions}
            placeholder="Member type"
            isSearchable={false}
          />
        </div>

        <div className="col-6 mt-20">
          <h3 className="font-20-semiBold opacity-38-italic mt-30">
            Please note : On contract members are not same as full time members
          </h3>
        </div>
      </div>
    );
  };

  /*=================================================================
      renderRow3
  =================================================================*/
  // renderRow3 = () => {
  //   return (
  //     <div className="col-12">
  //       <DatePickerFromToDate
  //         //labelStart="Contract Start date"
  //         startDateValue={this.state.startDate}
  //         //labelEnd="Contract End date"
  //         endDateValue={this.state.endDate}
  //         handleChangeStart={this.handleChangeStart}
  //         handleChangeEnd={this.handleChangeEnd}
  //         placeholderEnd="Contract End date"
  //         placeholderStart="Contract Start date"
  //       />
  //     </div>
  //   );
  // };

  /*=================================================================
      renderRow4
  =================================================================*/
  renderRow4 = () => {
    return (
      <div className="col-12 pl-0">
        <h5 className="font-18-bold color-offwhite mt-40">Working Hours</h5>
        <div className="mt-50 edit-resources-modal-datepicket">
          <DatepickerFromToTime
            //title="Working hours"
            fromTimeValue={this.state.fromTime}
            toTimeValue={this.state.toTime}
            handleChangeFromTime={this.handleChangeFromTime}
            handleChangeToTime={this.handleChangeFromTime}
            defaultToTime={setHours(setMinutes(new Date(), 0), 17)}
            placeholder="Working hours"
          />
        </div>
      </div>
    );
  };

  /*=================================================================
      renderRow5
  =================================================================*/
  renderRow5 = () => {
    return (
      <div className="row mx-0">
        <div className="col-6 pl-0 pt-60">
          <h5 className="font-18-bold color-offwhite">Cost to Company Hours</h5>
          <InputFieldNumber
            containerClassName="container-login-flow-input container-login-flow-input--forms mt-50"
            //label="cost to company per hour( $ )"
            placeholder="cost to company per hour( $ )"
            name="cost"
            value={this.state.cost}
            onChange={this.handleChangeNumber}
          />
        </div>
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
        containerClassName="upload-img__mainBlock"
        buttonName="+ New Doc"
        fileNameValue={this.state.fileName}
        // acceptType="image/jpeg, image/png"
        onChange={this.handleOnChangeUploadDocuments}
        handleOnClickRemoveDocument={this.handleOnClickRemoveDocument}
      />
    );
  };

  /*=================================================================
      renderRow6
  =================================================================*/
  renderRow6 = () => {
    return (
      <div className="row mx-0">
        <div className="col-10 pl-0">
          <h3 className="font-18-bold color-offwhite mb-20">
            Attach Document <span className="text-lowercase">(if any)</span>
          </h3>
          {this.renderUploadMultipleFiles()}
        </div>
      </div>
    );
  };

  /*============================================================
      main
  ============================================================*/
  render() {
    const { editCardData, isEditModalOpen, onCloseModal } = this.props;
    const { selectedOption, memberTypeSelected } = this.state;

    return (
      <div>
        {console.log(editCardData)}
        <Modal
          open={isEditModalOpen}
          onClose={onCloseModal}
          closeOnEsc={false}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal:
              "customModal customModal--clientEditModal customModal--clientEditModal--edit-resources",
            closeButton: "customCloseButton",
          }}
        >
          {/* close modal */}
          <span className="closeIconInModal" onClick={onCloseModal} />
          {/* content */}
          <div className="edit-client-modal-content edit-client-modal-content--resources">
            {this.renderTitleBlock()}
            <div className="mb-50">
              <Select
                isSearchable={false}
                className="react-select-container"
                classNamePrefix="react-select-elements"
                value={selectedOption}
                onChange={this.handleDropdownChange}
                options={options}
                placeholder="Select"
              />
            </div>

            {selectedOption.value === "Profile" && (
              <>
                <div className="edit-client-work-overflow-div">
                  {this.renderProfileContent()}
                </div>
              </>
            )}

            {selectedOption.value === "Work" && (
              <>
                <div className="edit-client-work-overflow-div">
                  {this.renderMemberTypeRow()}
                  {memberTypeSelected.label !== "Full Time Member"
                  //&&  this.renderRow3()
                  }
                  {this.renderRow4()}
                  {this.renderRow5()}
                  {this.renderRow6()}
                </div>
              </>
            )}
            <div className="row mx-0">
              <div className="col-12 text-right">
                <GreenButtonSmallFont
                  text="Save"
                  onClick={this.handleOnClickSave}
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default connect(null, { fileUpload, updateResourceAction })(
  EditResourcesModal
);
