import React, { Component } from "react";
import GrayLinkSmallFont from "../common/GrayLinkSmallFont";
import PageTitle from "../common/PageTitle";
import Select from "react-select";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import TextareaField from "../common/TextareaField";
// import UploadFile from "../common/UploadFile";
// api
import isEmpty from "../../../store/validations/is-empty";
import { fileUpload } from "./../../../store/actions/resourcesAction";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { addNewTicket } from "./../../../store/actions/supportAction";
import { getAllResourceAction } from "./../../../store/actions/resourcesAction";
import { getAllProjectAction } from "./../../../store/actions/projectAction";
import UploadMultipleFiles from "../common/UploadMultipleFiles";
import { AddTicketValidation } from "./../../../store/validations/supportValidation/AddTicketValidation";

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

let countComponentUpdate = 0;

let optionsAssignTo = [];
let optionsProject = [];

class SupportAddNewTicket extends Component {
  constructor() {
    super();
    this.state = {
      raised: "",
      subject: "",
      selectedOptionProjectName: [],
      selectedOptionAssignTo: [],
      selectedOptionPriority: optionsPriority[0],
      selectedOptionType: optionsType[0],
      description: "",
      fileName: [],
      // api
      fileData: [],
      allResources: {},
      allProjects: {},
      errors: {},
    };
  }

  /*==========================================================================
        lifecycle methods
  ============================================================================*/
  componentDidMount() {
    this.props.getAllResourceAction();
    this.props.getAllProjectAction();
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allResources) &&
      nextProps.allResources !== nextState.allResources
    ) {
      return {
        allResources: nextProps.allResources,
      };
    }
    if (
      !isEmpty(nextProps.allProjects) &&
      nextProps.allProjects !== nextState.allProjects
    ) {
      return {
        allProjects: nextProps.allProjects,
      };
    }
    return null;
  }

  componentDidUpdate() {
    let { allResources, allProjects } = this.state;

    if (!isEmpty(allResources) && !isEmpty(allProjects)) {
      countComponentUpdate += 1;
    }
    // update optionsAssignTo
    if (!isEmpty(allResources) && countComponentUpdate === 1) {
      let newArray = allResources.map((resource) => ({
        value: resource._id,
        label: resource.name,
      }));
      optionsAssignTo.push(...newArray);
      this.setState({
        selectedOptionAssignTo: optionsAssignTo[0],
      });
    }
    // update optionsProject
    if (!isEmpty(allProjects) && countComponentUpdate === 1) {
      let newArrayProject = allProjects.map((project) => ({
        value: project._id,
        label: project.name,
      }));
      optionsProject.push(...newArrayProject);
      this.setState({
        selectedOptionProjectName: optionsProject[0],
      });
    }
  }

  componentWillUnmount() {
    countComponentUpdate = 0;
    optionsAssignTo = [];
    optionsProject = [];
  }

  /*==========================================================================
        handlers
  ============================================================================*/
  handleChangeAssignToDropdown = (selectedOptionAssignTo) => {
    this.setState({ selectedOptionAssignTo });
  };

  handleChangeNameDropdown = (selectedOptionProjectName) => {
    this.setState({ selectedOptionProjectName });
  };

  handleChangePriorityDropdown = (selectedOptionPriority) => {
    this.setState({ selectedOptionPriority });
  };

  handleChangeTypeDropdown = (selectedOptionType) => {
    this.setState({ selectedOptionType });
  };

  handleOnChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      errors: {},
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

  handleSave = (e) => {
    e.preventDefault();
    const { errors, isValid } = AddTicketValidation(this.state);
    if (!isValid) {
      this.setState({
        errors: errors,
      });
    } else {
      const formData = {
        subject: this.state.subject,
        assignedTo: this.state.selectedOptionAssignTo.value,
        project: this.state.selectedOptionProjectName.value,
        priority: this.state.selectedOptionPriority.value,
        type: this.state.selectedOptionType.value,
        status: "INPROGRESS",
        description: this.state.description,
        attachments: isEmpty(this.state.fileData) ? [] : this.state.fileData,
      };
      this.props.addNewTicket(formData, this.props.history);
    }
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
        containerClassName="upload-img__mainBlock upload-img__mainBlock--new-client upload-img__mainBlock--new-client--add-invoice"
        buttonName="Upload Documents"
        //buttonName="+ New Doc"
        fileNameValue={this.state.fileName}
        // acceptType="image/jpeg, image/png"
        onChange={this.handleOnChangeUploadDocuments}
        handleOnClickRemoveDocument={this.handleOnClickRemoveDocument}
      />
    );
  };

  /*===========================================================================
        main
  ============================================================================*/
  render() {
    const { errors } = this.state;
    return (
      <>
        <div className="new-ticket-btn">
          <div className="pageTitle-topNavbar-div">
            <PageTitle title="new ticket" />
            <GrayLinkSmallFont
              path="/support"
              text="Go Back"
              extraClassName="ticket-btn"
            />
          </div>
          <div className="row mx-0 newTicket-row1">
            <div className="col-4 px-0">
              <InputFieldEmailTextPassword
                containerClassName="container-login-flow-input container-login-flow-input--forms"
                //label="Subject"
                placeholder="Subject"
                name="subject"
                value={this.state.subject}
                onChange={this.handleOnChange}
                type="text"
                error={!isEmpty(errors.subject) && errors.subject}
              />
            </div>
            <div className="col-4 px-0 pt-20">
              {/*  <h3 className="font-18-bold-space-light-uppercase mb-20">
                assign to
    </h3>*/}
              <Select
                isSearchable={false}
                className="react-select-container  react-select-container--addMember"
                classNamePrefix="react-select-elements"
                value={this.state.selectedOptionAssignTo}
                onChange={this.handleChangeAssignToDropdown}
                options={optionsAssignTo}
                placeholder="assign to"
                //placeholder="Select"
              />
            </div>
            <div className="col-4 px-0 pt-20">
              {/*<h3 className="font-18-bold-space-light-uppercase mb-20">
                project name
  </h3>*/}
              <Select
                isSearchable={false}
                className="react-select-container react-select-container--addMember"
                classNamePrefix="react-select-elements"
                value={this.state.selectedOptionProjectName}
                onChange={this.handleChangeNameDropdown}
                options={optionsProject}
                placeholder="project name"
                //placeholder="Select"
              />
              {errors.projectName ? (
                <p className="error-message">{errors.projectName}</p>
              ) : (
                <p className="error-message opacity-0">error</p>
              )}
            </div>
          </div>
          {/* row 2 */}
          <div className="row mx-0 newTicket-row2">
            <div className="col-4 px-0">
              {/*{!isEmpty(this.props.auth) && (*/}
              <InputFieldEmailTextPassword
                containerClassName="disabled-input-field container-login-flow-input container-login-flow-input--forms"
                //label="raised by"
                name="raised"
                placeholder="raised by"
                value={this.props.auth.name}
                onChange={this.handleOnChange}
                type="text"
                isDisabled={true}
                isReadonly={true}
              />
              {/*)}*/}
            </div>
            <div className="col-4 px-0">
              {/*<h3 className="font-18-bold-space-light-uppercase mb-20">
                Priority
              </h3>*/}
              <Select
                isSearchable={false}
                className="react-select-container react-select-container--addMember"
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
                className="react-select-container react-select-container--addMember"
                classNamePrefix="react-select-elements"
                value={this.state.selectedOptionType}
                onChange={this.handleChangeTypeDropdown}
                options={optionsType}
                //placeholder="Select"
                placeholder="type"
              />
            </div>
          </div>

          {/* row 3 */}
          <div className="row mx-0 flex-nowrap newTicket-row3">
            <div className="col-7 px-0">
              <TextareaField
                containerClassName="container-login-flow-textarea container-login-flow-textarea--add-ticket"
                //label="description"
                placeholder="Enter your text"
                name="description"
                value={this.state.description}
                onChange={this.handleOnChange}
              />
            </div>
            <div className="col-6 px-0">
              <h3 className="font-18-bold-space-light-uppercase mb-20">
                attach document <span className="text-lowercase">(if any)</span>
              </h3>
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
            <GreenButtonSmallFont text="Add" onClick={this.handleSave} />
          </div>
        </div>
      </>
    );
  }
}

const mapStateToprops = (state) => ({
  auth: state.auth.user,
  allResources: state.resources.allResources,
  allProjects: state.projects.allProjects,
});

export default connect(mapStateToprops, {
  fileUpload,
  addNewTicket,
  getAllResourceAction,
  getAllProjectAction,
})(withRouter(SupportAddNewTicket));
