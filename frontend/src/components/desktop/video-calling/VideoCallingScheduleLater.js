import React, { Component } from "react";
import Modal from "react-responsive-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setHours, setMinutes } from "date-fns";
import Select from "react-select";
import GreenButtonBigFont from "../common/GreenButtonBigFont";

const options = [
  { value: "Lorem 1", label: "Lorem 1" },
  { value: "Lorem 2", label: "Lorem 2" },
  { value: "Lorem 3", label: "Lorem 3" },
  { value: "Lorem 4", label: "Lorem 4" },
  { value: "Lorem 5", label: "Lorem 5" },
];
const imgList = [1, 2, 3, 4, 5, 6];
export class VideoCallingScheduleLater extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      startDate: new Date(),
      scheduleTime: setHours(setMinutes(new Date(), 0), 10),
      selectedOption: null,
    };
  }
  /*=========================================
              open modal
  =========================================*/
  openModal = () => {
    this.setState({
      open: true,
    });
  };

  /*=========================================
              close Modal
  =========================================*/
  onCloseModal = () => {
    this.setState({
      open: false,
    });
  };

  /*=========================================
                handler
  =========================================*/
  handleChangeDate = (date) => {
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

  handleChangeFromTime = (time) => {
    if (time === null) {
      this.setState({
        scheduleTime: new Date(),
      });
    } else {
      this.setState({
        scheduleTime: time,
      });
    }
    console.log(this.state.scheduleTime);
  };

  handleChangeOption = (selectedOption) => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  handleRemoveMember = () => {
    console.log("member delete");
  };

  handleSubmit = () => {
    console.log(this.state);
    this.setState({
      open: false,
    });
  };
  /*=========================================
  
                render Modal

  =========================================*/
  renderModal = () => {
    const { open } = this.state;
    return (
      <div>
        <Modal
          open={open}
          onClose={this.onCloseModal}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal:
              "customModal customModal--videoCallingScheduleModal customModal--videoCallingShareMeetingLink--add",
            closeButton: "customCloseButton",
          }}
        >
          <span className="closeIconInModal" onClick={this.onCloseModal} />
          <h2 className="video-calling-share-meeting-link-title mt-30 text-center">
            Schedule Call
          </h2>
          <div className="video-calling-modal-content">
            <div className="row mx-0">
              <div>
                {/*  <h3 className="font-18-bold-space-light-uppercase mb-20 mr-30">
                  date
              </h3>*/}
                <div className="date-picker-common">
                  <DatePicker
                    selected={this.state.startDate}
                    onChange={this.handleChangeDate}
                    placeholderText="Date"
                  />
                  <div className="datepeacker-date-icon-div">
                    <img
                      src={require("../../../assets/img/icons/new-date-icon.svg")}
                      alt="date"
                    />
                  </div>
                </div>
              </div>
              <div className="schedule-later-paddding-div">
                {/*<h3 className="font-18-bold-space-light-uppercase mb-20 mr-30">
                  time
            </h3>*/}
                <div className="date-picker-common">
                  <DatePicker
                    selected={this.state.scheduleTime}
                    onChange={this.handleChangeFromTime}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    dateFormat="h:mm aa"
                    timeCaption="Time"
                    default={this.defaultscheduleTime}
                    placeholderText="Time"
                  />
                </div>
              </div>
            </div>
            <div className="row mx-0 mt-15">
              <div>
                {/*<h3 className="font-18-bold-space-light-uppercase mb-20">
                  select participants
          </h3>*/}
                <Select
                  className="react-select-container react-select-container--addMember mb-40"
                  classNamePrefix="react-select-elements"
                  value={this.state.selectedOption}
                  onChange={this.handleChangeOption}
                  options={options}
                  placeholder="select participants"
                  isSearchable={false}
                />
              </div>
            </div>
            <div>
              <h3 className="font-18-bold font-18-bold--schedule-later-selected-participant mb-20">
                Selected Participants
              </h3>
              <div className="row mx-0 schedule-later-member-img calendar-add-meeting-modal-list-overflow--schedule-later">
                {imgList.map((key, data) => (
                  <div
                    key={key}
                    className="create-project-add-member-img-text-block"
                  >
                    <div className="create-project-add-member-img-block">
                      <img
                        src={require("../../../assets/img/video-calling/new-add-participant-icon.svg")}
                        alt="member"
                        className="create-project-add-member-img-block__imgMember"
                      />
                      <i
                        className="fa fa-close create-project-add-member-img-block__remove"
                        onClick={this.handleRemoveMember}
                      ></i>
                      <h5 className="schedule-later-15-bold">Jen Doe</h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-10 row mx-0 justify-content-end">
              <GreenButtonBigFont
                text="Schedule"
                onClick={this.handleSubmit}
                extraClassName="schedule-later-schedule-btn"
              />
            </div>
          </div>
        </Modal>
      </div>
    );
  };

  /*=========================================
  
                render

  =========================================*/
  render() {
    return (
      <div>
        {this.renderModal()}
        <button className="login-dashboard-btn" onClick={this.openModal}>
          Schedule Later
        </button>
      </div>
    );
  }
}

export default VideoCallingScheduleLater;
