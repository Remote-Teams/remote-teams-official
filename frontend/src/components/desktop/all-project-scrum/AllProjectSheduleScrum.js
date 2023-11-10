import React, { Component } from "react";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import { setHours, setMinutes } from "date-fns";
import Modal from "react-responsive-modal";
import DatePickerFromToDate from "../common/DatePickerFromToDate";
import ToggleTimesheet from "../common/ToggleTimesheet";
import DatepickerFromToTime from "../common/DatePickerFromToTime";
import Select from "react-select";
import { connect } from "react-redux";
import { createScrum } from "./../../../store/actions/projectAction";
import isEmpty from "../../../store/validations/is-empty";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import TaskMemberDisplayList from "../common/TaskMemberDisplayList";
import { AddScrumValidation } from "./../../../store/validations/projectValidation/AddScrumValidation";

// const options = [
//   { value: "Member 1", label: "Member 1" },
//   { value: "Member 2", label: "Member 2" },
//   { value: "Member 3", label: "Member 3" },
//   { value: "Member 4", label: "Member 4" },
//   { value: "Member 5", label: "Member 5" },
// ];

class AllProjectSheduleScrum extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      options: [],
      startDate: new Date(),
      endDate: new Date(),
      fromTime: setHours(setMinutes(new Date(), 0), 10),
      toTime: setHours(setMinutes(new Date(), 0), 11),
      isStatusActive: false,
      isStatusActiveMail: true,
      displayListSelected: [],
      invite: "",
      title: "",
      errors: {},
    };
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allResources) &&
      nextProps.allResources !== nextState.allResources
    ) {
      let newArray =
        !isEmpty(nextProps.allResources) &&
        nextProps.allResources.map((user) => ({
          value: user._id,
          label: user.name,
        }));
      return {
        allResources: nextProps.allResources,
        options: newArray,
      };
    }
    return null;
  }

  /*===============================================================================
              handler
===============================================================================*/

  onCloseModal = () => {
    this.setState({
      open: false,
    });
  };

  openSecduleScrum = () => {
    this.setState({
      open: true,
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

  handleOnChangeToggle = (e) => {
    this.setState({
      [e.target.name]: e.target.checked,
    });
  };
  handleOnChangeToggleMail = (e) => {
    this.setState({
      [e.target.name]: e.target.checked,
    });
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

  handleChangeSelectClient = (selectedOption) => {
    this.setState({
      invite: selectedOption,
    });

    // add option to list if it's not present in list
    let newList = this.state.displayListSelected;
    if (newList.indexOf(selectedOption) === -1) {
      newList.push(selectedOption);
      this.setState({
        displayListSelected: newList,
      });
    }
    // console.log(`Option selected:`, selectedOption);
  };

  handleRemoveMember = (index) => (e) => {
    let newList = this.state.displayListSelected;
    newList.splice(index, 1);
    this.setState({
      displayListSelected: newList,
    });
  };

  callBackAddScrum = (status) => {
    if (status === 200) {
      this.setState({
        open: false,
      });
    }
  };

  handleSave = () => {
    console.log(this.state);
    const { displayListSelected, isStatusActive } = this.state;

    let selectedMembers = [];

    if (!isEmpty(displayListSelected)) {
      displayListSelected.forEach((element) => {
        selectedMembers.push(element.value);
      });
    }

    const { errors, isValid } = AddScrumValidation(this.state);

    if (!isValid) {
      this.setState({
        errors: errors,
      });
    } else {
      let projectData = JSON.parse(localStorage.getItem("projectData"));
      const formData = {
        name: this.state.title,
        project: projectData._id,
        attendees: selectedMembers,
        fromTime: this.state.fromTime.toISOString(),
        toTime: this.state.toTime.toISOString(),
        daily_scrum: isStatusActive,
        fromDate: this.state.startDate.toISOString(),
        toDate: this.state.endDate.toISOString(),
        emailNotify: this.state.isStatusActiveMail,
      };

      this.props.createScrum(formData, this.callBackAddScrum);
    }
  };
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      errors: {},
    });
  };

  /*==================================================================
                   Modal
  ===============================================================*/

  renderShedule = () => {
    const { open, displayListSelected, errors } = this.state;
    /*=======================================================================
        arrowImgTag
  =======================================================================*/

    const arrowImgTag = (
      <img
        src="/img/project-details/arrow-right-white.svg"
        alt="next"
        className="arrow-img"
      />
    );

    return (
      <>
        <Modal
          open={open}
          onClose={this.onCloseModal}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal customModal--sheduleModal",
            closeButton: "customCloseButton",
          }}
        >
          <span className="closeIconInModal" onClick={this.onCloseModal} />
          <div className="scrum-modal-content">
            {/*<h2 className="font-32-extraBold-letterspace mt-30 mb-50 text-center">
              schedule scrum
        </h2>*/}
            <h2 className="add-meeting-title add-meeting-title--create-module">
              schedule scrum
            </h2>
            <div className="row mx-0">
              <div>
                <InputFieldEmailTextPassword
                  containerClassName="container-login-flow-input container-login-flow-input--scrum"
                  placeholder="title"
                  id="title"
                  name={"title"}
                  value={this.state.title}
                  onChange={this.handleChange}
                  type="text"
                  error={!isEmpty(errors) && errors.title}
                />
                <div className="all-project-scrum-shedule-scrum-date-div">
                  <DatePickerFromToDate
                    //labelStart="from date"
                    startDateValue={this.state.startDate}
                    //labelEnd="to Date( optional)"
                    endDateValue={this.state.endDate}
                    handleChangeStart={this.handleChangeStart}
                    handleChangeEnd={this.handleChangeEnd}
                    placeholderStart="from date"
                    placeholderEnd="to Date( optional)"
                  />
                </div>
              </div>
              <div className="shedule-toggle-1">
                <h3 className="font-18-bold-space-light-uppercase mb-40">
                  daily scrum
                </h3>
                <ToggleTimesheet
                  textClassName="font-18-regular"
                  name="isStatusActive"
                  text1={"Yes"}
                  text2={"No"}
                  onChange={this.handleOnChangeToggle}
                  defaultChecked={this.state.isStatusActive}
                />
              </div>
            </div>
            <div className="row flex-nowrap mx-0 all-project-scrum-modal-row2 pt-3">
              <div className="all-project-scrum-modal-row2-time">
                <DatepickerFromToTime
                  fromTimeValue={this.state.fromTime}
                  toTimeValue={this.state.toTime}
                  handleChangeFromTime={this.handleChangeFromTime}
                  handleChangeToTime={this.handleChangeToTime}
                  defaultToTime={setHours(setMinutes(new Date(), 0), 10)}
                />
              </div>
              <div className="shedule-toggle-2">
                <h3 className="font-18-bold-space-light-uppercase mb-40">
                  mail notification
                </h3>
                <ToggleTimesheet
                  textClassName="font-18-regular"
                  name="isStatusActiveMail"
                  text1={"Yes"}
                  text2={"No"}
                  onChange={this.handleOnChangeToggleMail}
                  defaultChecked={this.state.isStatusActiveMail}
                />
              </div>
            </div>
            <div className="pb-10">
              <div className="datepicker-mr">
                <h3 className="font-18-bold font-18-bold--add-scrum mb-20">
                  Invite
                </h3>
                <Select
                  className="react-select-container react-select-container--addMember mb-40"
                  classNamePrefix="react-select-elements"
                  value={this.state.invite}
                  onChange={this.handleChangeSelectClient}
                  options={this.state.options}
                  placeholder="Select"
                  isSearchable={false}
                />
              </div>

              <h4 className="add-new-task-selected-member-text">
                Selected members
              </h4>

              {!isEmpty(displayListSelected) && (
                <>
                  <TaskMemberDisplayList
                    displayListSelected={displayListSelected}
                    handleRemoveMember={this.handleRemoveMember}
                  />
                </>
              )}
              {/* <div className="row mx-0 flex-nowrap calendar-add-meeting-modal-list-overflow calendar-add-meeting-modal-list-overflow--shedule">
                  {displayListSelected.map((data, index) => (
                    <div
                      key={index}
                      className="create-project-add-member-img-text-block"
                    >
                      <div className="create-project-add-member-img-block">
                        <img
                          src={require("../../../assets/img/dummy/selected-member-profile-new.svg")}
                          //src={require("../../../assets/img/dummy/access-role-resource.svg")}
                          alt="member"
                          className="create-project-add-member-img-block__imgMember"
                        />
                        <i
                          className="fa fa-minus create-project-add-member-img-block__remove"
                          onClick={this.handleRemoveMember(index)}
                        ></i>
                      </div>
                      <h4 className="font-18-semiBold">{data.label}</h4>
                    </div>
                  ))}
                </div> */}
            </div>
            <div className="text-center all-project-scrum-schedule-btn-div">
              <GreenButtonSmallFont
                extraClassName="task-save-btn"
                onClick={this.handleSave}
                text={
                  <>
                    Schedule Scrum
                    {arrowImgTag}
                  </>
                }
              />
            </div>
          </div>
        </Modal>
      </>
    );
  };
  render() {
    console.log(this.state.allResources);
    return (
      <div>
        {this.renderShedule()}
        <GreenButtonSmallFont
          text={"Schedule Scrum"}
          onClick={this.openSecduleScrum}
          extraClassName="add-discussion-btn add-discussion-btn--scheduleScrum"
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  allResources: state.resources.allResources,
});

export default connect(mapStateToProps, { createScrum })(
  AllProjectSheduleScrum
);
