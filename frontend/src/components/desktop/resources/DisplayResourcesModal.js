import React, { Component } from "react";
import { setHours, setMinutes } from "date-fns";
// import Checkbox from "rc-checkbox";
// import "rc-checkbox/assets/index.css";
import Modal from "react-responsive-modal";
import Select from "react-select";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
// import UploadFile from "../common/UploadFile";
//import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import { connect } from "react-redux";
import { updateResourceAction } from "./../../../store/actions/resourcesAction";
import isEmpty from "../../../store/validations/is-empty";
import { fileUpload } from "./../../../store/actions/resourcesAction";
import dateFns from "date-fns";
import { url } from "../../../store/actions/config";
import UploadMultipleFilesListDisplay from "../common/UploadMultipleFilesListDisplay";
import InputFieldPhoneCountryNumber from "../common/InputFieldPhoneCountryNumber";
//import DatePickerFromToDate from "../common/DatePickerFromToDate";
import DatepickerFromToTime from "../common/DatePickerFromToTime";

const imgResourceDemo = require("../../../assets/img/dummy/resource-without-border.svg");

const options = [
  { value: "Profile", label: "Profile" },
  { value: "Work", label: "Work" },
];

const memberTypeOptions = [
  { value: "Full Time Member", label: "Full Time Member" },
  { value: "Freelancer", label: "Freelancer" },
  { value: "Contract Member", label: "Contract Member" },
];

class DisplayResourcesModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: options[0],
      //  renderTitleBlock
      profileImagefileName: imgResourceDemo,
      fname: "First Name",
      lname: "Last Name",
      emailAddress: "email@gmail.com",
      //   renderProfileContent
      dateOfBirth: new Date(),
      location: "",
      countryCode: "",
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
      dateOfBirth:
        !isEmpty(editCardData.additionalInfo) &&
        new Date(editCardData.additionalInfo.dateOfBirth),
      countryCode:
        !isEmpty(editCardData.additionalInfo) &&
        editCardData.additionalInfo.country_code,
      location: editCardData.location,
      phoneNumber: editCardData.phone,
      cost: editCardData.contract.ctc,
      fromTime: new Date(editCardData.contract.working_hrs_from),
      toTime: new Date(editCardData.contract.working_hrs_to),
      memberTypeSelected: editCardData.memberType,
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

  handleDropdownChange = (selectedOption) => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  /*============================================================
      renderTitleBlock
  ============================================================*/
  renderTitleBlock = () => {
    const btnName = <i className="fa fa-pencil" />;
    return (
      <div className="row mx-0 flex-nowrap align-items-start mb-15">
        <div className="web-client-icon web-client-icon--client web-client-icon--client--display">
          <img
            src={require("../../../assets/img/dummy/new-square-profile-img.png")}
            //src={require("../../../assets/img/dummy/new-profile-placeholder-with-border.svg")}
            //src={require("../../../assets/img/dummy/resource-without-border.svg")}
            alt="person"
            className="img-wh-100"
          />
        </div>

        <div>
          <div className="row mx-0">
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--forms container-login-flow-input--editResource"
              //label=""
              name="fname"
              value={this.state.fname}
              onChange={this.handleChange}
              type="text"
              isReadOnly={true}
            />
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--forms container-login-flow-input--editResource"
              //label=""
              name="lname"
              value={this.state.lname}
              onChange={this.handleChange}
              type="text"
              isReadOnly={true}
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
              isReadOnly={true}
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
          {/*<h3 className="font-18-bold-space-light-uppercase mb-20 mr-30">
            date of birth
          </h3>
          <p className="font-18-semiBold mb-50">
            {dateFns.format(this.state.dateOfBirth, "D-MM-YYYY")}
    </p>*/}
          <h3 className="font-18-bold color-offwhite">Date of Birth</h3>
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms mt-30"
            //label=""
            name="dateOfBirth"
            value={dateFns.format(this.state.dateOfBirth, "D-MM-YYYY")}
            onChange={this.handleChange}
            type="text"
            isReadOnly={true}
            placeholder="date of birth"
          />
        </div>
        <div className="col-6">
          {/*<h3 className="font-18-bold-space-light-uppercase mb-20 mr-30">
            Location
          </h3>
  <p className="font-18-semiBold mb-50">{this.state.location}</p>*/}
          <h3 className="font-18-bold color-offwhite">Location</h3>
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms mt-30"
            //label=""
            name="location"
            value={this.state.location}
            onChange={this.handleChange}
            type="text"
            isReadOnly={true}
            placeholder="Location"
          />
        </div>
        <div className="col-12 pl-0">
          {/*<h3 className="font-18-bold-space-light-uppercase mb-20 mr-30">
            contact number
          </h3>
          <p className="font-18-semiBold mb-50">
            {this.state.countryCode + this.state.phoneNumber}
</p>*/}
          {/**container-login-flow-input--forms--display-clients */}
          <div>
            <h3 className="font-18-bold color-offwhite">Phone Number</h3>
            <InputFieldPhoneCountryNumber
              containerClassName="container-login-flow-input container-login-flow-input--forms container-login-flow-input--add-new-client-pnumber mt-30"
              //label="contact number"
              placeholder="Contact  number"
              name="phoneNumber"
              value={this.state.phoneNumber}
              //countryCode={this.state.countryCode}
              //handleChangeCountryCode={this.handleChangeCountryCodeMultiContact}
              //onChange={this.handleChangeNumberMultiContact()}
              errorCountryCode={""}
              errorPhone={""}
              isReadOnly
            />
          </div>
        </div>
      </div>
    );
  };

  /*=================================================================
      renderMemberTypeRow
  =================================================================*/
  renderMemberTypeRow = () => {
    return (
      <>
        <h3 className="font-18-bold color-offwhite">Member Type</h3>
        <div className="row mx-0 ">
          <div className="col-5 pl-0">
            {/**mb-30 */}
            {/*<h3 className="font-18-bold-space-light-uppercase mb-20 mr-30">
            Member type
          </h3>
          <p className="font-18-semiBold mb-50">
            {this.state.memberTypeSelected}
    </p>*/}
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--forms mt-50"
              //label=""
              name="memberTypeSelected"
              value={this.state.memberTypeSelected}
              onChange={this.handleChange}
              type="text"
              isReadOnly={true}
              placeholder="Member type"
            />
          </div>

          <div className="col-6 mt-20">
            <h3 className="font-20-semiBold opacity-38-italic ">
              Please note : On contract members are not same as full time
              members
            </h3>
          </div>
        </div>
      </>
    );
  };

  /*=================================================================
      renderRow3
  =================================================================*/
  //renderRow3 = () => {
  //  return (
  //    <div className="row mx-0">
  //      <div className="col-5">
  //        {/*<h3 className="font-18-bold-space-light-uppercase mb-20 mr-30">
  //          Contract Start date
  //  </h3>*/}
  //        <div className="display-client-date-border-div">
  //          <span>{dateFns.format(this.state.startDate, "D-MM-YYYY")}</span>
  //          <div className="datepeacker-date-icon-div">
  //            <img
  //              src={require("../../../assets/img/icons/new-date-icon.svg")}
  //              alt="date"
  //            />
  //          </div>
  //        </div>
  //      </div>
  //      <div className="col-5">
  //        {/*<h3 className="font-18-bold-space-light-uppercase mb-20 mr-30">
  //          Contract End date
  //</h3>*/}
  //        <div className="display-client-date-border-div">
  //          <span>{dateFns.format(this.state.endDate, "D-MM-YYYY")}</span>
  //          <div className="datepeacker-date-icon-div">
  //            <img
  //              src={require("../../../assets/img/icons/new-date-icon.svg")}
  //              alt="date"
  //            />
  //          </div>
  //        </div>
  //      </div>
  //     </div>
  //  );
  //};

  /*=================================================================
      renderRow4
  =================================================================*/
  renderRow4 = () => {
    return (
      <>
        <div className="col-12 p-0">
          <h5 className="font-18-bold color-offwhite mt-40">Working Hours</h5>
          {/*          <h3 className="pt-50 font-18-bold-space-light-uppercase mb-20 mr-30">
            Working hours
          </h3>
    */}{" "}
          <div className="row p-0 mx-0 mt-50">
            <div className="col-4 pl-0">
              <div className="display-client-date-border-div">
                <span>
                  {console.log(this.state.fromTime)}
                  {dateFns.format(this.state.fromTime, "hh:mm A")}
                </span>
              </div>
            </div>
            <div className="col-1">
              {/*  <h3 className="font-18-bold-space-light-uppercase mb-20 text-center ">
                To
    </h3>*/}
            </div>
            <div className="col-4">
              <div className="display-client-date-border-div">
                <span>{dateFns.format(this.state.toTime, "hh:mm A")}</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  /*=================================================================
      renderRow5
  =================================================================*/
  renderRow5 = () => {
    return (
      <div className="row mx-0">
        <div className="col-6 pt-65 pl-0">
          <h5 className="font-18-bold color-offwhite mt-40">
            Cost to Company Hours
          </h5>
          {/*<h3 className="font-18-bold-space-light-uppercase mb-20 mr-30 pt-50">
            cost to company per hour( $ )
          </h3>
    <p className="font-18-semiBold mb-50">{this.state.cost}</p>}*/}
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms mt-50"
            //label=""
            name="memberTypeSelected"
            value={this.state.cost}
            onChange={this.handleChange}
            type="text"
            isReadOnly={true}
            placeholder="cost to company per hour( $ )"
          />
        </div>
      </div>
    );
  };

  /*=================================================================
        renderListOfDocumentsAttached
  =================================================================*/
  handleOnClickDocumentName = (data) => (e) => {
    let dataToken = JSON.parse(localStorage.getItem("UserData"));
    return window.open(
      `${url}${data.fileUrlPath}&token=${dataToken.token}`,
      "_blank"
    );
  };

  renderListOfDocumentsAttached = () => {
    return (
      <>
        <UploadMultipleFilesListDisplay
          dataDocuments={this.state.fileData}
          handleOnClickDocumentName={this.handleOnClickDocumentName}
        />
      </>
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
            Attach Document{" "}
            {/*<span className="text-lowercase">(if any)</span>*/}
          </h3>
          {this.renderListOfDocumentsAttached()}
        </div>
      </div>
    );
  };

  /*============================================================
      main
  ============================================================*/
  render() {
    const { editCardData, isDisplayModalOpen, onCloseModal } = this.props;
    const { selectedOption, memberTypeSelected } = this.state;

    return (
      <div>
        {console.log(editCardData)}
        <Modal
          open={isDisplayModalOpen}
          onClose={onCloseModal}
          closeOnEsc={false}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal customModal--clientEditModal",
            closeButton: "customCloseButton",
          }}
        >
          {/* close modal */}
          <span className="closeIconInModal" onClick={onCloseModal} />
          {/* content */}
          <div className="edit-client-modal-content">
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
                  //&& this.renderRow3()
                  }
                  {this.renderRow4()}
                  {this.renderRow5()}
                  {this.renderRow6()}
                </div>
              </>
            )}
            {/* <div className="row mx-0">
              <div className="col-12 text-right">
                <GrayButtonSmallFont text="Close" onClick={this.onCloseModal} />
              </div>
            </div> */}
          </div>
        </Modal>
      </div>
    );
  }
}

export default connect(null, { fileUpload, updateResourceAction })(
  DisplayResourcesModal
);
