import React, { Component } from "react";
import GrayLinkSmallFont from "../common/GrayLinkSmallFont";
import PageTitle from "../common/PageTitle";
import Select from "react-select";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import TextareaField from "../common/TextareaField";
// import UploadFile from "../common/UploadFile";
import * as moment from "moment";
// api
import isEmpty from "../../../store/validations/is-empty";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { fileUpload } from "./../../../store/actions/resourcesAction";
import { updateTicket } from "./../../../store/actions/supportAction";
import UploadMultipleFiles from "../common/UploadMultipleFiles";

const optionsName = [
  { value: "Project 1", label: "Project 1" },
  { value: "Project 2", label: "Project 2" },
  { value: "Project 3", label: "Project 3" },
  { value: "Project 4", label: "Project 4" },
];
const optionsPriority = [
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
];
const optionsType = [
  { value: "ISSUE", label: "Issue" },
  { value: "DEFECT", label: "Defect" },
  { value: "EVENT", label: "Event" },
  { value: "REQUEST_STATUS_UPDATE", label: "Request Status Update" },
];

class SupportEditTicket extends Component {
  constructor() {
    super();
    this.state = {
      raised: "",
      subject: "",
      selectedOptionName: optionsName[0],
      selectedOptionAssignTo: [],
      optionsAssignTo: [],
      allResources: {},
      selectedOptionPriority: optionsPriority[0],
      selectedOptionType: optionsType[0],
      description: "",
      fileName: [],
      fileData: [],
    };
  }

  /*==========================================================================
        lifecycle methods
  ============================================================================*/
  componentDidMount() {
    this.setInitialData();
  }

  setInitialData = () => {
    const {
      ticketData,
      optionsAssignToDropdown,
      optionsProjectDropdown,
    } = this.props.location.state;

    let assignedToObj = optionsAssignToDropdown.filter(
      (a) => a.label === ticketData.assignedTo.name
    );

    let priorityObj = optionsPriority.filter(
      (a) => a.value === ticketData.priority
    );

    let typeObj = optionsType.filter((a) => a.value === ticketData.type);

    let projectObj = optionsProjectDropdown.filter(
      (a) => a.label === ticketData.project.name
    );

    this.setState({
      raised: ticketData.raisedBy.name,
      subject: ticketData.subject,
      selectedOptionName: projectObj[0],
      selectedOptionAssignTo: assignedToObj[0],
      optionsAssignTo: optionsAssignToDropdown,
      selectedOptionPriority: priorityObj[0],
      selectedOptionType: typeObj[0],
      description: ticketData.description,
      fileName: isEmpty(ticketData.attachments)
        ? []
        : ticketData.attachments.map((doc) => doc.originalname),
      fileData: isEmpty(ticketData.attachments) ? [] : ticketData.attachments,
    });
  };

  /*==========================================================================
        handlers
  ============================================================================*/
  handleChangeAssignToDropdown = (selectedOptionAssignTo) => {
    this.setState({ selectedOptionAssignTo });
  };

  // handleChangeNameDropdown = (selectedOptionName) => {
  //   this.setState({ selectedOptionName });
  // };

  handleChangePriorityDropdown = (selectedOptionPriority) => {
    this.setState({ selectedOptionPriority });
  };

  handleChangeTypeDropdown = (selectedOptionType) => {
    this.setState({ selectedOptionType });
  };

  handleOnChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  // callBackAttachDoc = (data) => {
  //   this.setState({
  //     fileData: data,
  //   });
  // };

  // handleOnChangeAttachDoc = (e) => {
  //   e.preventDefault();
  //   const data = new FormData();
  //   data.append("file", e.target.files[0]);
  //   this.setState({
  //     fileName:
  //       e.target.files.length > 0 ? e.target.files[0].name : e.target.value,
  //   });
  //   this.props.fileUpload(data, this.callBackAttachDoc);
  // };

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
        containerClassName="upload-img__mainBlock upload-img__mainBlock--new-client upload-img__mainBlock--new-client--add-invoice"
        buttonName="New Doc"
        fileNameValue={this.state.fileName}
        // acceptType="image/jpeg, image/png"
        onChange={this.handleOnChangeUploadDocuments}
        handleOnClickRemoveDocument={this.handleOnClickRemoveDocument}
      />
    );
  };

  /*===========================================================================
      renderUploadMultipleFiles end
  ============================================================================*/

  handleOnClickMarkButton = (status) => (e) => {
    e.preventDefault();
    const { ticketData } = this.props.location.state;

    const formData = {
      subject: this.state.subject,
      assignedTo: this.state.selectedOptionAssignTo.value,
      project: this.state.selectedOptionName.value,
      priority: this.state.selectedOptionPriority.value,
      type: this.state.selectedOptionType.value,
      status: status,
      description: this.state.description,
      attachments: isEmpty(this.state.fileData) ? [] : this.state.fileData,
    };
    this.props.updateTicket(ticketData._id, formData, this.props.history);
  };

  /*===========================================================================
        main
  ============================================================================*/
  render() {
    const { ticketData } = this.props.location.state;
    const ticketNum = moment().unix();
    const pagetitleText = "Ticket " + ticketNum;
    return (
      <>
        <div className="new-ticket-btn">
          <div className="pageTitle-topNavbar-div">
            <PageTitle title={pagetitleText} shadow="ticket" />
            <GrayLinkSmallFont
              path="/support"
              text="Go Back"
              extraClassName="ticket-btn"
            />
          </div>
          <div className="row mx-0 newTicket-row1">
            <div className="col-4 px-0">
              <InputFieldEmailTextPassword
                containerClassName="disabled-input-field container-login-flow-input container-login-flow-input--forms"
                //label="Subject"
                placeholder="Subject"
                name="subject"
                value={this.state.subject}
                onChange={this.handleOnChange}
                type="text"
                isDisabled={true}
                isReadonly={true}
              />
            </div>
            <div className="col-4 px-0">
              {/*<h3 className="font-18-bold-space-light-uppercase mb-20">
                assign to
    </h3>*/}
              <Select
                isSearchable={false}
                className="react-select-container react-select-container--addMember react-select-container--new-ticket"
                classNamePrefix="react-select-elements"
                value={this.state.selectedOptionAssignTo}
                onChange={this.handleChangeAssignToDropdown}
                options={this.state.optionsAssignTo}
                placeholder="Assign to"
              />
            </div>
            <div className="col-4 px-0">
              {/*<h3 className="font-18-bold-space-light-uppercase mb-20">
                project name
  </h3>*/}
              <Select
                isSearchable={false}
                className="react-select-container react-select-container--addMember react-select-container--new-ticket"
                classNamePrefix="react-select-elements"
                value={this.state.selectedOptionName}
                // onChange={this.handleChangeNameDropdown}
                // options={optionsName}
                placeholder="project name"
                //placeholder="Select"
                isDisabled={true}
              />
            </div>
          </div>
          {/* row 2 */}
          <div className="row mx-0 newTicket-row2">
            <div className="col-4 px-0">
              <InputFieldEmailTextPassword
                containerClassName="disabled-input-field container-login-flow-input container-login-flow-input--forms"
                //label="raised by"
                placeholder="raised by"
                name="raised"
                value={this.state.raised}
                onChange={this.handleOnChange}
                type="text"
                isDisabled={true}
                isReadonly={true}
              />
            </div>
            <div className="col-4 px-0">
              {/*<h3 className="font-18-bold-space-light-uppercase mb-20">
                Priority
</h3>*/}
              <Select
                isSearchable={false}
                className="react-select-container react-select-container--addMember react-select-container--new-ticket"
                classNamePrefix="react-select-elements"
                value={this.state.selectedOptionPriority}
                onChange={this.handleChangePriorityDropdown}
                options={optionsPriority}
                placeholder="Priority"
                //placeholder="Select"
              />
            </div>
            <div className="col-4 px-0">
              {/*<h3 className="font-18-bold-space-light-uppercase mb-20">type</h3>*/}
              <Select
                isSearchable={false}
                className="react-select-container react-select-container--addMember react-select-container--new-ticket"
                classNamePrefix="react-select-elements"
                value={this.state.selectedOptionType}
                onChange={this.handleChangeTypeDropdown}
                options={optionsType}
                //placeholder="Select"
                placeholder="type"
                isDisabled={true}
              />
            </div>
          </div>

          {/* row 3 */}
          <div className="row mx-0 flex-nowrap newTicket-row3">
            <div className="col-7 px-0">
              <TextareaField
                containerClassName="container-login-flow-textarea"
                label="Description/Solution/Remarks"
                name="description"
                value={this.state.description}
                onChange={this.handleOnChange}
              />
            </div>
            <div className="col-6 px-0">
              {isEmpty(this.state.fileName) ? (
                <h3 className="font-18-bold-space-light-uppercase mb-20">
                  attach document{" "}
                  <span className="text-lowercase">(if any)</span>
                </h3>
              ) : (
                <h3 className="font-18-bold-space-light-uppercase mb-20">
                  attached document
                </h3>
              )}
              {/* <UploadFile
                containerClassName="upload-img__mainBlock"
                buttonName="+ Document"
                fileNameValue={this.state.fileName}
                acceptType="application/pdf, application/msword"
                onChange={this.handleOnChangeAttachDoc}
              /> */}
              {this.renderUploadMultipleFiles()}
            </div>
          </div>

          <div className="add-ticket-btn">
            <GrayButtonSmallFont
              text="Mark as In Progress"
              onClick={this.handleOnClickMarkButton("INPROGRESS")}
              extraClassName="edit-support-btn"
            />
            <GrayButtonSmallFont
              text="Mark as On Hold"
              onClick={this.handleOnClickMarkButton("ONHOLD")}
              extraClassName="edit-support-btn"
            />
            <GreenButtonSmallFont
              text="Mark as Closed"
              onClick={this.handleOnClickMarkButton("ANSWERED")}
              extraClassName="edit-support-btn"
            />
          </div>
        </div>
      </>
    );
  }
}

export default connect(null, {
  fileUpload,
  updateTicket,
})(withRouter(SupportEditTicket));
