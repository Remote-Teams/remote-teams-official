import React, { Component } from "react";
import UploadImage from "../common/UploadImage";
import { setHours, setMinutes } from "date-fns";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Checkbox from "rc-checkbox";
import "rc-checkbox/assets/index.css";
import PageTitle from "../common/PageTitle";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import InputFieldNumber from "../common/InputFieldNumber";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import UploadFile from "../common/UploadFile";
import LoginFlowAccessRoleInfoModal from "./LoginFlowAccessRoleInfoModal";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getAllUserRoles } from "./../../../store/actions/authAction";
import { inviteTeamMember } from "./../../../store/actions/resourcesAction";
import { fileUpload } from "./../../../store/actions/resourcesAction";
import isEmpty from "../../../store/validations/is-empty";
import InputFieldPhoneCountryNumber from "../common/InputFieldPhoneCountryNumber";
import DatepickerFromToTime from "../common/DatePickerFromToTime";
import DatePickerFromToDate from "../common/DatePickerFromToDate";
import UploadMultipleFiles from "../common/UploadMultipleFiles";
import { validateAddResource } from "./../../../store/validations/resourceValidation/AddResourceValidation";

const options = [
  { value: "Admin", label: "Admin" },
  { value: "Project manager", label: "Project manager" },
  { value: "Resource", label: "Resource" },
];

const memberTypeOptions = [
  { value: "Full Time Member", label: "Full Time Member" },
  { value: "Freelancer", label: "Freelancer" },
  { value: "Contract Member", label: "Contract Member" },
];

class LoginFlowDashboardAddTeamMembers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdditionalInfo: false,
      fname: "",
      lname: "",
      fileNameCoverImg: "",
      emailAddress: "",
      accessRole: "",
      location: "",
      countryCode: "+1",
      phoneNumber: "",
      dateOfBirth: new Date(),
      memberTypeSelected: memberTypeOptions[0],
      startDate: new Date(),
      endDate: new Date(),
      fromTime: setHours(setMinutes(new Date(), 0), 9),
      toTime: setHours(setMinutes(new Date(), 0), 19),
      checkboxHours: false,
      cost: "",
      allResources: this.props.allResources,
      companyWorkingHours: this.props.companyWorkingHours,
      fileName: [],
      fileData: [],
      errors: {},
    };
  }

  /*============================================
              Lifrecycle Methods
  =============================================*/
  componentDidMount() {
    console.log(this.props.history);
    window.scrollTo(0, 0);
    this.props.getAllUserRoles();
  }

  componentDidUpdate() {
    if (this.props.allResources !== this.state.allResources) {
      this.setState({
        allResources: this.props.allResources,
      });
    }
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allRoles) &&
      nextProps.allRoles !== nextState.allRoles
    ) {
      return {
        allRoles: nextProps.allRoles,
      };
    }
    return null;
  }

  /*=================================================================
      handlers
  =================================================================*/

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      errors: {},
    });
  };

  handleOnChangeUploadImgCoverImage = (e) => {
    e.preventDefault();
    const data = new FormData();
    // data.append("image", e.target.files[0].name);
    data.append("file", e.target.files[0]);
    this.setState({
      fileNameCoverImg:
        e.target.files.length > 0
          ? URL.createObjectURL(e.target.files[0])
          : e.target.value,
    });
    this.props.fileUpload(data, this.callBackFileUpload);
  };

  handleChangeSelectRole = (selectedOption) => {
    this.setState({ accessRole: selectedOption, errors: {} });
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

  handleOnClickAdditionalInfoBtn = (e) => {
    e.preventDefault();
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
        checkboxHours: false,
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
        checkboxHours: false,
      });
    }
  };

  handleCheckboxChange = (e) => {
    console.log(e.target.checked);
    const { companyWorkingHours } = this.state;
    console.log(companyWorkingHours);
    if (!isEmpty(companyWorkingHours)) {
      if (e.target.checked === true) {
        this.setState({
          fromTime: new Date(companyWorkingHours[0].fromTime),
          toTime: new Date(companyWorkingHours[0].toTime),
        });
      } else {
        this.setState({
          fromTime: setHours(setMinutes(new Date(), 0), 9),
          toTime: setHours(setMinutes(new Date(), 0), 19),
        });
      }
    } else {
      alert("Working hours not set");
    }

    this.setState({
      [e.target.id]: e.target.checked,
    });
  };

  handleOnClickSave = (e) => {
    e.preventDefault();
    console.log(this.state);
    const { allRoles, accessRole, memberTypeSelected } = this.state;
    const { errors, isValid } = validateAddResource(this.state);

    if (!isValid) {
      this.setState({
        errors: errors,
      });
    } else {
      const formData = {
        recipients: [
          {
            email: this.state.emailAddress,
            firstName: this.state.fname,
            lastName: this.state.lname,
            profileImage:
              "https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg.jpg",
            additionalInfo: {
              dateOfBirth: this.state.dateOfBirth.toISOString(),
              country_code: this.state.countryCode,
            },
            memberType:
              memberTypeSelected.value === "Freelancer"
                ? "FREELANCER"
                : memberTypeSelected.value === "Full Time Member"
                ? "FULLTIME"
                : "CONTRACTUAL",
            phone: this.state.phoneNumber,
            location: this.state.location,
            timezone: "",
            contract: {
              start_date: this.state.startDate.toISOString(),
              end_date: this.state.endDate.toISOString(),
              working_hrs_to: this.state.toTime.toISOString(),
              working_hrs_from: this.state.fromTime.toISOString(),
              ctc: parseInt(this.state.cost),
              attachments: this.state.fileData,
            },
            demo: false,
            role:
              accessRole.value === "Admin"
                ? allRoles[3]._id
                : accessRole.value === "Project manager"
                ? allRoles[1]._id
                : allRoles[0]._id,
            dateOfJoining: new Date().toISOString(),
            jobTitle: this.state.accessRole.value,
          },
        ],
      };

      this.props.inviteTeamMember(formData, this.props.history);
    }
  };

  /*=================================================================
      renderRow1
  =================================================================*/
  renderRow1 = () => {
    const { errors } = this.state;
    return (
      <div className="row mx-0 align-items-start">
        <div className="col-4">
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms"
            //label="First name"
            placeholder="First name"
            name="fname"
            value={this.state.fname}
            onChange={this.handleChange}
            type="text"
            error={!isEmpty(errors.fname) && errors.fname}
          />
        </div>
        <div className="col-4">
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms"
            //label="Last name"
            placeholder="Last name"
            name="lname"
            value={this.state.lname}
            onChange={this.handleChange}
            type="text"
            error={!isEmpty(errors.lname) && errors.lname}
          />
        </div>
        <div className="col-4">
          <UploadImage
            containerClassName="upload-img__mainBlock upload-img__mainBlock--new-client-img"
            buttonName="+ Cover Image"
            fileNameValue={this.state.fileNameCoverImg}
            acceptType="image/jpeg, image/png"
            onChange={this.handleOnChangeUploadImgCoverImage}
          />
        </div>
      </div>
    );
  };

  /*=================================================================
      renderRow1
  =================================================================*/
  renderRow2 = () => {
    const { errors } = this.state;
    return (
      <div className="row mx-0">
        <div className="col-4">
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms mt-50"
            //label="Email address"
            placeholder="Email address"
            name="emailAddress"
            value={this.state.emailAddress}
            onChange={this.handleChange}
            type="email"
            error={!isEmpty(errors.emailAddress) && errors.emailAddress}
          />
        </div>
        <div className="col-4 mt-50">
          {/*<h3 className="font-18-bold-space-light-uppercase mb-20">
            Access role
    </h3>*/}
          <Select
            className="react-select-container react-select-container--addMember"
            classNamePrefix="react-select-elements"
            value={this.state.accessRole}
            onChange={this.handleChangeSelectRole}
            options={options}
            placeholder="Access role"
            isSearchable={false}
          />
          {!isEmpty(errors.accessRole) && (
            <p className="error-message">{errors.accessRole}</p>
          )}
          <LoginFlowAccessRoleInfoModal />
        </div>
        <div className="col-4 p-0">
          <div className="font-18-bold-space-light-uppercase mb-20 opacity-0">
            opacity zero
          </div>

          {this.state.isAdditionalInfo ? (
            /*<GrayButtonSmallFont
              text="- Additional info"
              onClick={this.handleOnClickAdditionalInfoBtn}
            />*/
            <div className="gradient-btn">
              <button onClick={this.handleOnClickAdditionalInfoBtn}>
                - Additional info
              </button>
            </div>
          ) : (
            /*<GrayButtonSmallFont
              text="+ Additional info"
              onClick={this.handleOnClickAdditionalInfoBtn}
            />*/
            <div className="gradient-btn">
              <button onClick={this.handleOnClickAdditionalInfoBtn}>
                + Additional info
              </button>
            </div>
          )}
        </div>
        {this.state.isAdditionalInfo && (
          <>
            <div className="col-4">
              <InputFieldPhoneCountryNumber
                containerClassName="container-login-flow-input container-login-flow-input--forms"
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
            <div className="col-4"></div>
            <div className="col-4 mb-50">
              <div className="date-picker-common">
                {/*<h3 className="font-18-bold-space-light-uppercase mb-20">
                  date of birth
        </h3>*/}
                <DatePicker
                  minDate={new Date()}
                  selected={this.state.dateOfBirth}
                  onChange={this.handleChangeDate}
                  placeholderText="Date of birth"
                />
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  /*=================================================================
      renderMemberTypeRow
  =================================================================*/
  renderMemberTypeRow = () => {
    return (
      <div className="row mx-0">
        <div className="col-4 ">
          {/*<h3 className="font-18-bold-space-light-uppercase mb-20">
            Member type
    </h3>*/}
          <Select
            className="react-select-container react-select-container--addMember"
            classNamePrefix="react-select-elements"
            value={this.state.memberTypeSelected}
            onChange={this.handleChangeSelectMemberType}
            options={memberTypeOptions}
            //placeholder="Select"
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
  renderRow3 = () => {
    return (
      <div className="col-12">
        <DatePickerFromToDate
          labelStart="Contract Start date"
          startDateValue={this.state.startDate}
          labelEnd="Contract End date"
          endDateValue={this.state.endDate}
          handleChangeStart={this.handleChangeStart}
          handleChangeEnd={this.handleChangeEnd}
        />
      </div>
    );
  };

  /*=================================================================
      renderRow4
  =================================================================*/
  renderRow4 = () => {
    return (
      <div className="row mx-0">
        <div className="col-12 login-dashboard-working-hours-block mt-40">
          <DatepickerFromToTime
            title="Working hours"
            fromTimeValue={this.state.fromTime}
            toTimeValue={this.state.toTime}
            handleChangeFromTime={this.handleChangeFromTime}
            handleChangeToTime={this.handleChangeToTime}
            defaultToTime={setHours(setMinutes(new Date(), 0), 17)}
          />
        </div>
        <div className="col-12 mt-40">
          <div className="customCheckbox customCheckbox--add-member mb-20">
            <Checkbox
              id="checkboxHours"
              onChange={this.handleCheckboxChange}
              value={this.state.checkboxHours}
              checked={this.state.checkboxHours}
              defaultChecked={false}
            />
            <label htmlFor="checkboxHours">
              {/*<span className="font-24-semiBold ml-30">*/}
              <span className="font-14-semibold-italic ml-20 pb-10">
                Use Default Company Hours
              </span>
            </label>
          </div>
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
        <div className="col-4">
          <InputFieldNumber
            containerClassName="container-login-flow-input container-login-flow-input--forms"
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
        containerClassName="upload-img__mainBlock upload-img__mainBlock--new-client"
        //buttonName="+ New Doc"
        buttonName="Choose files"
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
        <div className="col-7 mt-40">
          <h3 className="font-18-bold-space-light-uppercase mb-20">
            attach document <span className="text-lowercase">(if any)</span>
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
    const { memberTypeSelected } = this.state;
    console.log(this.state.checkboxHours);
    return (
      <div className="login-member-day-offs">
        {/* page title */}
        <PageTitle title="Add a member" shadow="Add member" />
        <form noValidate autoComplete="off">
          <div className="login-member-day-offs__content mt-50">
            <h2 className="font-29-bold mb-50">Profile</h2>
            {this.renderRow1()}
            {this.renderRow2()}
            <h2 className="font-29-bold mb-50">Work</h2>
            {this.renderMemberTypeRow()}
            {memberTypeSelected.label !== "Full Time Member" &&
              this.renderRow3()}
            {this.renderRow4()}
            {this.renderRow5()}
            {this.renderRow6()}
            <div className="row mx-0 pt-20">
              <div className="col-12 pt-20">
                <GreenButtonSmallFont
                  text="Save"
                  onClick={this.handleOnClickSave}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  allRoles: state.auth.allRoles,
});

export default connect(mapStateToProps, {
  inviteTeamMember,
  getAllUserRoles,
  fileUpload,
})(withRouter(LoginFlowDashboardAddTeamMembers));
