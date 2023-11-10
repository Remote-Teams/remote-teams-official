import React, { Component, Fragment } from "react";
import Select from "react-select";
import differenceInCalendarDays from "date-fns/difference_in_calendar_days";
import GrayButtonSmallFont from "./../common/GrayButtonSmallFont";
import Modal from "react-responsive-modal";
import DatePickerFromToDate from "../common/DatePickerFromToDate";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import { connect } from "react-redux";
import { addLeaveAction } from "./../../../store/actions/calenderAction";

const options = [
  { value: "Paid", label: "Paid" },
  { value: "Medical", label: "Medical" },
  { value: "Unpaid", label: "Unpaid" },
];

let daysCalculated = "0";

export class CalenderAddLeaves extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      leaveType: options[0],
      startDate: new Date(),
      endDate: new Date(),
    };
  }

  /*=================================================================
          handlers
=================================================================*/

  onCloseModal = () => {
    this.setState({
      open: false,
    });
  };

  openAddLeaveModel = () => {
    this.setState({
      open: true,
    });
  };

  handleChangeSelectClient = (selectedOption) => {
    this.setState({ leaveType: selectedOption });
    console.log(`Option selected:`, selectedOption);
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

  callBackAddLeave = (status) => {
    if (status === 200) {
      this.setState({
        open: false,
        leaveType: "",
        startDate: new Date(),
        endDate: new Date(),
      });
    }
  };

  handleOnClickApply = () => {
    // console.log(this.state);
    const formData = {
      leaveType:
        this.state.leaveType.value === "Unpaid"
          ? "UNPAID_LEAVE"
          : this.state.leaveType.value === "Paid"
          ? "PAID_LEAVE"
          : this.state.leaveType.value === "Medical"
          ? "SICK_LEAVE"
          : "PAID_LEAVE",
      leaveStatus: "PENDING",
      fromDate: this.state.startDate.toISOString(),
      toDate: this.state.endDate.toISOString(),
      reason: this.state.leaveType.value,
    };
    // console.log(formData);
    this.props.addLeaveAction(formData, this.callBackAddLeave);
  };

  /*=================================================================
          renderAddLevesModel
=================================================================*/
  renderAddLevesModel = () => {
    const { open } = this.state;
    daysCalculated =
      differenceInCalendarDays(this.state.endDate, this.state.startDate) + 1;
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
            modal: "customModal customModal--apply-leave",
            closeButton: "customCloseButton",
          }}
        >
          <span className="closeIconInModal" onClick={this.onCloseModal} />
          <div className="edit-client-modal-content edit-client-modal-content--apply-leaves">
            <div className="add-meeting-title-div">
              <h2 className="add-meeting-title">Apply Leave</h2>
            </div>
            <div className="col-12 mb-50 pt-60 pb-10">
              <div>
                {/*<h3 className="font-18-bold-space-light-uppercase mb-20">
                  Type of Leave
        </h3>*/}
                <Select
                  className="react-select-container react-select-container--addMember mb-40"
                  classNamePrefix="react-select-elements"
                  value={this.state.leaveType}
                  onChange={this.handleChangeSelectClient}
                  options={options}
                  placeholder="Type of Leave"
                  isSearchable={false}
                />
              </div>
            </div>
            <div className="col-12 pb-10">
              <DatePickerFromToDate
                //labelStart="Start date"
                startDateValue={this.state.startDate}
                //labelEnd="End date"
                endDateValue={this.state.endDate}
                handleChangeStart={this.handleChangeStart}
                handleChangeEnd={this.handleChangeEnd}
                placeholderStart="Start date"
                placeholderEnd="End date"
              />
            </div>

            <div className="row mx-0 align-items-center pl-30 pt-40">
              <h3 className="font-18-bold-space-light-uppercase mr-50 pr-10">
                days calculated
              </h3>

              {daysCalculated > 0 ? (
                <p className="apply-leaves-calculated-text">{daysCalculated}</p>
              ) : (
                <p className="apply-leaves-calculated-text">0</p>
              )}
            </div>

            <div className="text-center pt-60">
              <GreenButtonSmallFont
                text="Apply"
                onClick={this.handleOnClickApply}
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
    return (
      <div>
        {this.renderAddLevesModel()}
        <GrayButtonSmallFont
          text={"Add Leave"}
          onClick={this.openAddLeaveModel}
          extraClassName="calender-add-leave-btn"
        />
      </div>
    );
  }
}

export default connect(null, { addLeaveAction })(CalenderAddLeaves);
