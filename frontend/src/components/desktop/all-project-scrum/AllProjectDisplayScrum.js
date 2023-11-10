import React, { useState } from "react";
import DatePickerFromToDate from "../common/DatePickerFromToDate";
import ToggleTimesheet from "../common/ToggleTimesheet";
import DatepickerFromToTime from "../common/DatePickerFromToTime";
import Select from "react-select";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import { setHours, setMinutes } from "date-fns";
import Modal from "react-responsive-modal";

const options = [
  { value: "Member 1", label: "Member 1" },
  { value: "Member 2", label: "Member 2" },
  { value: "Member 3", label: "Member 3" },
  { value: "Member 4", label: "Member 4" },
  { value: "Member 5", label: "Member 5" },
];

export default function AllProjectDisplayScrum() {
  const [values, setValues] = useState({
    startDate: new Date(),
    endDate: new Date(),
    fromTime: setHours(setMinutes(new Date(), 0), 10),
    toTime: setHours(setMinutes(new Date(), 0), 11),
    invite: "",
    title: "",
    displayListSelected: [],
  });

  //const [displayListSelected, setDisplayListsSelected] = useState([]);
  const [open, setOpen] = useState(false);
  /*===========================================================================
      handlers
  ===========================================================================*/
  const onHandleModal = () => {
    setOpen(!open);
  };
  const handleChangeStart = (date) => {
    if (date === null) {
      setValues({
        ...values,
        startDate: new Date(),
      });
    } else {
      setValues({
        ...values,
        startDate: date,
      });
    }
  };

  const handleChangeEnd = (date) => {
    if (date === null) {
      setValues({
        ...values,
        endDate: new Date(),
      });
    } else {
      setValues({
        ...values,
        endDate: date,
      });
    }
  };

  const handleOnChangeToggle = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.checked,
    });
  };

  const handleOnChangeToggleMail = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.checked,
    });
  };

  const handleChangeFromTime = (time) => {
    if (time === null) {
      setValues({
        ...values,
        fromTime: new Date(),
      });
    } else {
      setValues({
        ...values,
        fromTime: time,
      });
    }
  };

  const handleChangeToTime = (time) => {
    if (time === null) {
      setValues({
        ...values,
        toTime: new Date(),
      });
    } else {
      setValues({
        ...values,
        toTime: time,
      });
    }
  };

  const handleChangeSelectClient = (selectedOption) => {
    setValues({
      ...values,
      invite: selectedOption,
    });

    // add option to list if it's not present in list
    let newList = values.displayListSelected;
    if (newList.indexOf(selectedOption) === -1) {
      newList.push(selectedOption);
      setValues({
        ...values,
        displayListSelected: newList,
      });
    }
    // console.log(`Option selected:`, selectedOption);
  };

  const handleRemoveMember = (index) => (e) => {
    let newList = values.displayListSelected;
    newList.splice(index, 1);
    setValues({
      ...values,
      displayListSelected: newList,
    });
  };

  const handleSave = () => {
    console.log(values);
    setOpen(!open);
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <GrayButtonSmallFont text={"View"} onClick={onHandleModal} />

      <Modal
        open={open}
        onClose={onHandleModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--sheduleModal",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={onHandleModal} />

        <div className="scrum-modal-content">
          <h2 className="add-meeting-title add-meeting-title--create-module">
            Scrum Details
          </h2>
          <div className="row mx-0">
            <div>
              <InputFieldEmailTextPassword
                containerClassName="container-login-flow-input container-login-flow-input--scrum"
                placeholder="title"
                id="title"
                name={"title"}
                value={values.title}
                //onChange={handleChange}
                isReadOnly={true}
                type="text"
              />
              <div className="all-project-scrum-modal-row1-date">
                <DatePickerFromToDate
                  //labelStart="from date"
                  startDateValue={values.startDate}
                  //labelEnd="to Date( optional)"
                  endDateValue={values.endDate}
                  handleChangeStart={handleChangeStart}
                  handleChangeEnd={handleChangeEnd}
                  placeholderStart="from date"
                  placeholderEnd="to Date( optional)"
                  readOnly={true}
                />
              </div>
            </div>
            <div className="shedule-toggle-1">
              <h3 className="font-18-bold-space-light-uppercase mb-40">
                daily scrum
              </h3>
              <ToggleTimesheet
                textClassName="font-18-regular"
                //name="isStatusActive"
                text1={"Yes"}
                text2={"No"}
                //onChange={handleOnChangeToggle}
                defaultChecked={true}
                isDisabled={true}
              />
            </div>
          </div>
          <div className="row flex-nowrap mx-0 all-project-scrum-modal-row2 pt-3">
            <div className="all-project-scrum-modal-row2-time">
              <DatepickerFromToTime
                fromTimeValue={values.fromTime}
                toTimeValue={values.toTime}
                handleChangeFromTime={handleChangeFromTime}
                handleChangeToTime={handleChangeToTime}
                defaultToTime={setHours(setMinutes(new Date(), 0), 10)}
                readOnly={true}
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
                //onChange={handleOnChangeToggleMail}
                defaultChecked={true}
                isDisabled={true}
              />
            </div>
          </div>
          <div className="row mx-0 flex-nowrap all-project-scrum-modal-row3 pb-10">
            <div className="datepicker-mr">
              <h3 className="font-18-bold font-18-bold--add-scrum mb-20">
                Invite
              </h3>
              <Select
                className="react-select-container react-select-container--addMember mb-40"
                classNamePrefix="react-select-elements"
                value={values.invite}
                //onChange={handleChangeSelectClient}
                options={options}
                placeholder="Select"
                isSearchable={false}
                isDisabled={true}
              />
            </div>

            <div>
              <div className="row mx-0 flex-nowrap calendar-add-meeting-modal-list-overflow calendar-add-meeting-modal-list-overflow--shedule">
                {values.displayListSelected.map((data, index) => (
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
                        onClick={handleRemoveMember(index)}
                      ></i>
                    </div>
                    <h4 className="font-18-semiBold">{data.label}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="text-right all-project-scrum-schedule-btn-div">
            <GreenButtonSmallFont text={"Schedule"} onClick={handleSave} />
          </div>
        </div>
      </Modal>
    </>
  );
}
