import React, { useState } from "react";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import Modal from "react-responsive-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setHours, setMinutes } from "date-fns";
import DatepickerFromToTime from "../common/DatePickerFromToTime";
import TextareaField from "../common/TextareaField";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import { createScrumNotes } from "./../../../store/actions/projectAction";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";

function AllProjectScrumAddNewEntry() {
  const params = useParams();
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    open: false,
    notes: "",
    date: new Date(),
    fromTime: setHours(setMinutes(new Date(), 0), 10),
    toTime: setHours(setMinutes(new Date(), 0), 11),
    notesTitle: "",
  });

  /*=================================================================
          handlers
  =================================================================*/

  const onCloseModal = () => {
    setValues({
      ...values,
      open: false,
    });
  };

  const openNewEntry = () => {
    setValues({
      ...values,
      open: true,
    });
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeDate = (date) => {
    if (date === null) {
      setValues({
        ...values,
        date: new Date(),
      });
    } else {
      setValues({
        ...values,
        date: date,
      });
    }
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

  const handelChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const callBackCreateNotes = (status) => {
    if (status === 200) {
      setValues({
        ...values,
        open: false,
      });
    }
  };

  const handleOnClickSave = () => {
    const formData = {
      scrumId: params.id,
      message: values.notes,
      addtionalObject: {
        title: values.notesTitle,
      },
    };

    dispatch(createScrumNotes(formData, callBackCreateNotes));
  };

  /*================================================================================
          renderNewEntry
==============================================================================*/
  const renderNewEntry = () => {
    const { open } = values;
    return (
      <>
        <Modal
          open={values.open}
          onClose={onCloseModal}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal customModal--sheduleModal",
            closeButton: "customCloseButton",
          }}
        >
          <span className="closeIconInModal" onClick={onCloseModal} />
          <div className="scrum-new-entery-content">
            {/*<h2 className="font-32-extraBold-letterspace mt-30 mb-50 text-center">
              scrum details
        </h2>*/}
            <h2 className="add-meeting-title add-meeting-title--create-module">
              Add Entry
            </h2>
            {/*<div className="row mx-0 align-items-start flex-nowrap">
              <div className="date-picker-common">
                {/*<h3 className="font-18-bold-space-light-uppercase mb-20">date</h3>
                <DatePicker
                  minDate={new Date()}
                  selected={values.date}
                  onChange={handleChangeDate}
                  placeholderText="Date"
                />
                <div className="datepeacker-date-icon-div">
                  <img
                    src={require("../../../assets/img/icons/new-date-icon.svg")}
                    alt="date"
                  />
                </div>
              </div>
              <div className="scrum-modal-time-div">
                <DatepickerFromToTime
                  //title="Timings"
                  fromTimeValue={values.fromTime}
                  toTimeValue={values.toTime}
                  handleChangeFromTime={handleChangeFromTime}
                  handleChangeToTime={handleChangeToTime}
                  defaultToTime={setHours(setMinutes(new Date(), 0), 10)}
                  placeholderText="Timings"
                />
              </div>
      </div>*/}
            <div className="all-project-scrum-add-new-entry-title-input">
              <h5 className="font-18-bold font-18-bold--add-scrum mb-30">
                Title
              </h5>
              <InputFieldEmailTextPassword
                containerClassName="container-login-flow-input"
                //label="Client name"
                placeholder="Notes Title"
                name="notesTitle"
                value={values.notesTitle}
                onChange={handleChange}
                type="text"
              />
            </div>
            <div>
              <h5 className="font-18-bold font-18-bold--add-scrum mb-30">
                Meeting Notes
              </h5>
              <TextareaField
                containerClassName="container-login-flow-textarea container-login-flow-textarea--scrum"
                label="notes"
                name="notes"
                value={values.notes}
                onChange={handelChange}
              />
            </div>
            <div className="text-right">
              <GreenButtonSmallFont
                text={"Add Entry"}
                onClick={handleOnClickSave}
                extraClassName="scrum-modal-btn"
              />
            </div>
          </div>
        </Modal>
      </>
    );
  };
  return (
    <div>
      <>
        {renderNewEntry()}
        <GrayButtonSmallFont
          text={"New Entry"}
          onClick={openNewEntry}
          extraClassName="scrum-add-new-entry"
        />
      </>
    </div>
  );
}

export default AllProjectScrumAddNewEntry;
