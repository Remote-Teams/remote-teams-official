import React, { Component } from "react";
import Select from "react-select";
import PageTitle from "../common/PageTitle";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import TextareaField from "../common/TextareaField";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import LoginFlowDashboardAddProjectAddMemberModal from "./LoginFlowDashboardAddProjectAddMemberModal";
import UploadImage from "../common/UploadImage";
import { connect } from "react-redux";
import { createNewProject } from "./../../../store/actions/projectAction";
import InputFieldNumber from "../common/InputFieldNumber";
import { fileUpload } from "./../../../store/actions/resourcesAction";
import DatePickerFromToDate from "../common/DatePickerFromToDate";
import isEmpty from "../../../store/validations/is-empty";
import { validateAddProject } from "./../../../store/validations/projectValidation/AddProjectValidation";

// const options = [
//   { value: "John", label: "Jon" },
//   { value: "Anna", label: "Anna" },
//   { value: "Paul", label: "Paul" },
// ];

class LoginFlowDashboardAddProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectName: "",
      clientName: "",
      fileName: "",
      startDate: "",
      endDate: "",
      cost: "",
      estimatedHours: "",
      description: "",
      logo: "",
      optionsClient: [],
      allResources: [],
      errors: {},
    };
  }

  /*=================================================================
      lifecycle methods
  =================================================================*/
  componentDidMount() {
    window.scrollTo(0, 0);
    // console.log(this.props.allClients);
    const { allClients, allResources } = this.props;
    if (!isEmpty(allClients)) {
      this.setDropdownOption();
    }
    if (!isEmpty(allResources)) {
      this.setState({
        allResources: allResources,
      });
    }
  }

  setDropdownOption = () => {
    const { allClients } = this.props;
    let newArray =
      !isEmpty(allClients) &&
      allClients.map((client) => ({
        value: client._id,
        label: client.name,
      }));
    this.setState({
      allClients: allClients,
      optionsClient: newArray,
    });
    console.log(newArray);
  };

  /*=================================================================
      handlers
  =================================================================*/

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      errors: {},
    });
  };

  handleChangeSelectClient = (selectedOption) => {
    this.setState({ clientName: selectedOption, errors: {} });
    console.log(`Option selected:`, selectedOption);
  };

  handleChangeNumber = (e) => {
    this.setState({
      [e.target.name]: e.target.validity.valid ? e.target.value : "",
      errors: {},
    });
  };

  callBackFileUpload = (data) => {
    console.log(data);
    this.setState({
      logo: data.fileUrl,
    });
  };

  handleOnChangeUploadImg = (e) => {
    e.preventDefault();
    const data = new FormData();
    // data.append("image", e.target.files[0].name);
    data.append("file", e.target.files[0]);
    this.setState({
      fileName:
        e.target.files.length > 0
          ? URL.createObjectURL(e.target.files[0])
          : e.target.value,
    });
    this.props.fileUpload(data, this.callBackFileUpload);
  };

  handleOnClickCreate = (e) => {
    e.preventDefault();
    console.log(this.state);
    const {
      projectName,
      startDate,
      endDate,
      clientName,
      logo,
      cost,
      estimatedHours,
      description,
    } = this.state;

    const { selectedMembersForProject } = this.props;
    let newArray = [];

    if (!isEmpty(selectedMembersForProject)) {
      let data = selectedMembersForProject.map((member) => member.value);
      newArray = data;
    }

    const { errors, isValid } = validateAddProject(this.state, newArray);

    // const formData = {
    //   name: this.state.projectName,
    //   clientName: this.state.clientName.value,
    //   members: newArray,
    //   logo: this.state.logo,
    //   startDate: this.state.startDate.toISOString(),
    //   endDate: this.state.endDate.toISOString(),
    //   estimatedCTC: parseInt(this.state.cost),
    //   estimatedHours: parseInt(this.state.estimatedHours),
    //   description: this.state.description,
    //   status: "In Progress",
    // };

    if (!isValid) {
      this.setState({
        errors: errors,
      });
    } else {
      const formData = {
        name: projectName,
        client: clientName.value,
        logo: logo,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        estimatedCTC: parseInt(cost),
        estimatedHours: parseInt(estimatedHours),
        description: description,
        resources: newArray,
        status: "UPCOMING",
      };

      this.props.createNewProject(formData);
    }
  };

  /*=================================================================
      renderRow1
  =================================================================*/
  renderRow1 = () => {
    const { errors } = this.state;
    return (
      <div className="row mx-0">
        <div className="col-4">
          <div className="row mx-0">
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--forms"
              //label="Project name"
              placeholder="Project Name"
              name="projectName"
              value={this.state.projectName}
              onChange={this.handleChange}
              type="text"
              error={!isEmpty(errors.projectName) && errors.projectName}
            />
          </div>
          <div className="row mx-0" style={{ display: "contents" }}>
            {/*<h3 className="font-18-bold-space-light-uppercase mb-20">
              Client name <span className="text-lowercase">(if any)</span>
    </h3>*/}
            <Select
              className="react-select-container react-select-container--addMember "
              classNamePrefix="react-select-elements"
              value={this.state.clientName}
              onChange={this.handleChangeSelectClient}
              options={this.state.optionsClient}
              placeholder="Client Name"
              //placeholder="Select"
              isSearchable={false}
            />
            {!isEmpty(errors.clientName) && (
              <p className="error-message">{errors.clientName}</p>
            )}
          </div>
        </div>
        <div className="col-4">
          <UploadImage
            containerClassName="upload-img__mainBlock upload-img__mainBlock--new-client-img"
            buttonName="+ Cover Image"
            fileNameValue={this.state.fileName}
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
  // handlers
  handleChangeStart = (date) => {
    if (date === null) {
      this.setState({
        startDate: new Date(),
      });
    } else {
      this.setState({
        startDate: date,
        errors: {},
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
        errors: {},
      });
    }
  };

  // renderRow2
  renderRow2 = () => {
    const { errors } = this.state;
    const labelEndDate = (
      <span>
        End date <span className="text-lowercase">(tentativey)</span>
      </span>
    );
    return (
      <div className="col-12 add-project-date-picker">
        <DatePickerFromToDate
          //labelStart="Start Date"
          placeholderStart="Start Date"
          startDateValue={this.state.startDate}
          //labelEnd={labelEndDate}
          placeholderEnd="End Date"
          endDateValue={this.state.endDate}
          handleChangeStart={this.handleChangeStart}
          handleChangeEnd={this.handleChangeEnd}
          error={errors}
        />
      </div>
    );
  };

  /*=================================================================
      renderCost
  ==================================================================*/
  renderCost = () => {
    const { errors } = this.state;
    return (
      <div className="row mx-0 mt-20">
        <div className="col-4 ">
          <InputFieldNumber
            containerClassName="container-login-flow-input container-login-flow-input--forms"
            //label="estimated cost to company( $ )"
            placeholder="estimated cost to company( $ )"
            name="cost"
            value={this.state.cost}
            onChange={this.handleChangeNumber}
            error={!isEmpty(errors.cost) && errors.cost}
          />
        </div>
        <div className="col-4">
          <InputFieldNumber
            containerClassName="container-login-flow-input container-login-flow-input--forms"
            //label="estimated hours"
            placeholder="estimated hours"
            name="estimatedHours"
            value={this.state.estimatedHours}
            onChange={this.handleChangeNumber}
            error={!isEmpty(errors.estimatedHours) && errors.estimatedHours}
          />
        </div>
      </div>
    );
  };

  /*=================================================================
      renderRow3
  =================================================================*/
  renderRow3 = () => {
    return (
      <div className="row mx-0 mt-20">
        <div className="col-4">
          <TextareaField
            containerClassName="container-login-flow-textarea"
            //label="description"
            placeholder="Project Description"
            name="description"
            value={this.state.description}
            onChange={this.handleChange}
          />
        </div>
      </div>
    );
  };

  /*=================================================================
      renderRow4
  =================================================================*/
  renderRow4 = () => {
    const { errors } = this.state;
    return (
      <div className="row mx-0">
        <div className="col-4">
          <h3 className="font-18-bold-space-light-uppercase mb-40">
            Add members
          </h3>
          <LoginFlowDashboardAddProjectAddMemberModal
            allResources={this.state.allResources}
          />
          {/* {!isEmpty(errors.memberName) && (
            <p className="error-message">{errors.memberName}</p>
          )} */}
        </div>
      </div>
    );
  };

  render() {
    console.log(this.state.allResources);
    return (
      <div className="login-member-day-offs">
        {/* page title */}
        <PageTitle title="create project" />

        <form noValidate autoComplete="off">
          <div className="login-member-day-offs__content mt-50">
            {this.renderRow1()}
            {this.renderRow2()}
            {this.renderCost()}
            {this.renderRow3()}
            {this.renderRow4()}
            <div className="row mx-0 mt-20">
              <div className="col-12">
                <GreenButtonSmallFont
                  text="Create"
                  onClick={this.handleOnClickCreate}
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
  allClients: state.client.allClients,
  allResources: state.resources.allResources,
  selectedMembersForProject: state.projects.selectedMembersForProject,
});

export default connect(mapStateToProps, { createNewProject, fileUpload })(
  LoginFlowDashboardAddProject
);
