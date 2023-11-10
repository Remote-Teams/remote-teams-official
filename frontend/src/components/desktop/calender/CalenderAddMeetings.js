import React, { Component, Fragment } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import GrayButtonSmallFont from "./../common/GrayButtonSmallFont";
import Modal from "react-responsive-modal";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import DatepickerFromToTime from "../common/DatePickerFromToTime";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import { connect } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import { addMeetingAction } from "./../../../store/actions/calenderAction";

// const options = [
//   { value: "Anna", label: "Anna" },
//   { value: "Paul", label: "Paul" },
// ];

export class CalenderAddMeetings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      title: "",
      date: new Date(),
      fromTime: new Date(),
      toTime: new Date(),
      displayListSelected: [],
      invite: "",
      optionMembers: [],
      allResources: [],
      hasSet: false,
    };
  }

  componentDidUpdate() {
    if (!isEmpty(this.props.allResources) && !this.state.hasSet) {
      this.setDropdownOption();
      this.setState({
        hasSet: true,
      });
    }
  }

  setDropdownOption = () => {
    const { allResources } = this.props;

    let newArray =
      !isEmpty(allResources) &&
      allResources.map((member) => ({
        value: member._id,
        label: member.firstName,
      }));
    this.setState({
      allResources: allResources,
      optionMembers: newArray,
    });
  };

  /*=================================================================
          handlers
  =================================================================*/

  onCloseModal = () => {
    this.setState({
      open: false,
    });
  };

  openAddMeeting = () => {
    this.setState({
      open: true,
    });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleChangeDate = (date) => {
    if (date === null) {
      this.setState({
        date: new Date(),
      });
    } else {
      this.setState({
        date: date,
      });
    }
  };

  handleChangeFromTime = (time) => {
    console.log(time);
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

  callBackAddMeet = (status) => {
    if (status === 200) {
      this.setState({
        open: false,
        title: "",
        date: new Date(),
        fromTime: new Date(),
        toTime: new Date(),
        invite: "",
      });
    }
  };

  handleOnClickAdd = () => {
    const { displayListSelected } = this.state;
    let userData = JSON.parse(localStorage.getItem("UserData"));
    let selectedMembersId = [];
    let data =
      !isEmpty(displayListSelected) &&
      displayListSelected.filter((member) =>
        selectedMembersId.push(member.value)
      );

    const formData = {
      subject: this.state.title,
      meetingDate: this.state.date.toISOString(),
      meetingTimeFrom: this.state.fromTime.toISOString(),
      meetingTimeTo: this.state.toTime.toISOString(),
      attendees: selectedMembersId,
      organizer: userData.id,
    };
    // console.log(formData);
    this.props.addMeetingAction(formData, this.callBackAddMeet);

    // console.log(this.state);
  };

  /*=================================================================
          renderAddMeeting
  =================================================================*/
  renderAddMeeting = () => {
    const { open, displayListSelected } = this.state;
    return (
      <Fragment>
        <Modal
          open={open}
          onClose={this.onCloseModal}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal customModal--calendarAddMeetingModal",
            closeButton: "customCloseButton",
          }}
        >
          <span className="closeIconInModal" onClick={this.onCloseModal} />
          <div className="edit-client-modal-content edit-client-modal-content--add-meeting">
            <div>
              <div className="add-meeting-title-div">
                <h2 className="add-meeting-title  text-center">Add meeting</h2>
              </div>
            </div>
            <div className="row mx-0 pt-50 flex-nowrap">
              <div className="datepicker-mr">
                <InputFieldEmailTextPassword
                  containerClassName="container-login-flow-input container-login-flow-input--forms mt-30"
                  //label="title"
                  placeholder="Title"
                  name="title"
                  value={this.state.title}
                  onChange={this.handleChange}
                  type="text"
                />
              </div>
              <div className="date-picker-common mt-30">
                {/*<h3 className="font-18-bold-space-light-uppercase mb-20">
                  date
        </h3>*/}
                <DatePicker
                  minDate={new Date()}
                  selected={this.state.date}
                  onChange={this.handleChangeDate}
                  placeholderText="On Date"
                />
                <div className="datepeacker-date-icon-div">
                  <img
                    src={require("../../../assets/img/icons/new-date-icon.svg")}
                    alt="date"
                  />
                </div>
              </div>
            </div>
            <div>
              <DatepickerFromToTime
                fromTimeValue={this.state.fromTime}
                toTimeValue={this.state.toTime}
                handleChangeFromTime={this.handleChangeFromTime}
                handleChangeToTime={this.handleChangeToTime}
                fromPlaceholder="From Time"
                toPlaceholder="To Time"
              />
            </div>
            <div className="row mx-0 flex-nowrap mt-50 pb-10">
              <div className="datepicker-mr">
                {/*<h3 className="font-18-bold-space-light-uppercase mb-20">
                  invite
      </h3>*/}
                <Select
                  className="react-select-container react-select-container--addMember mb-40"
                  classNamePrefix="react-select-elements"
                  value={this.state.invite}
                  onChange={this.handleChangeSelectClient}
                  options={this.state.optionMembers}
                  placeholder="Select"
                  isSearchable={false}
                />
              </div>
              <div>
                <h3 className="font-18-bold-space-light-uppercase mb-20">
                  selected members
                </h3>
                <div className="row mx-0 flex-nowrap calendar-add-meeting-modal-list-overflow">
                  {displayListSelected.map((data, index) => (
                    <div
                      key={index}
                      className="create-project-add-member-img-text-block"
                    >
                      <div className="create-project-add-member-img-block">
                        <img
                          src={require("../../../assets/img/dummy/new-profile-img.svg")}
                          //src={require("../../../assets/img/dummy/selected-member-profile-new.svg")}
                          alt="member"
                          className="create-project-add-member-img-block__imgMember"
                        />
                        <i
                          //className="fa fa-close create-project-add-member-img-block__remove"
                          className="fa fa-minus create-project-add-member-img-block__remove"
                          onClick={this.handleRemoveMember(index)}
                        ></i>
                      </div>
                      <h4 className="font-24-semiBold">{data.label}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center">
              <GreenButtonSmallFont
                text="Add"
                onClick={this.handleOnClickAdd}
              />
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  };

  /*=================================================================
          main
  =================================================================*/
  render() {
    // console.log(this.props.allResources);
    return (
      <div>
        {this.renderAddMeeting()}
        <GrayButtonSmallFont
          text={"Add Meeting"}
          onClick={this.openAddMeeting}
          extraClassName="calender-add-meeting-btn"
        />
      </div>
    );
  }
}

export default connect(null, { addMeetingAction })(CalenderAddMeetings);
