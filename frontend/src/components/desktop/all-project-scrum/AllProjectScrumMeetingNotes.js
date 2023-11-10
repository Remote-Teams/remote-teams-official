import React, { useState, useEffect } from "react";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import Modal from "react-responsive-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setHours, setMinutes } from "date-fns";
import DatepickerFromToTime from "../common/DatePickerFromToTime";
import TextareaField from "../common/TextareaField";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import { useDispatch } from "react-redux";
import { updateScrumNoteById } from "./../../../store/actions/projectAction";

export default function AllProjectScrumMeetingNotes({ notesData, isEdit }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const [values, setValues] = useState({
    notes: "",
    date: new Date(),
    fromTime: setHours(setMinutes(new Date(), 0), 10),
    toTime: setHours(setMinutes(new Date(), 0), 11),
    notesTitle: "",
  });

  useEffect(() => {
    // if (isEdit === false) {
    setValues({
      ...values,
      notes: notesData.message,
      date: new Date(notesData.scrumId.fromDate),
      fromTime: new Date(notesData.scrumId.fromTime),
      toTime: new Date(notesData.scrumId.toTime),
      notesTitle: notesData.addtionalObject.title,
    });
    // }
  }, [notesData, isEdit]);

  /*=============================================
                  handler
============================================*/

  const onOpenModal = () => {
    setOpen(!open);
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

  const callBackUpdate = (status) => {
    if (status === 200) {
      setOpen(false);
    }
  };
  const handleOnClickSave = () => {
    console.log(values);

    const formData = notesData;
    formData.addtionalObject.title = values.notesTitle;
    formData.message = values.notes;
    formData.scrumId = notesData.scrumId._id;

    dispatch(
      updateScrumNoteById(
        formData,
        notesData._id,
        notesData.scrumId._id,
        callBackUpdate
      )
    );
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  /*=============================================
                  Modal
============================================*/
  const renderModal = () => {
    return (
      <>
        <Modal
          open={open}
          onClose={onOpenModal}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal customModal--sheduleModal",
            closeButton: "customCloseButton",
          }}
        >
          <span className="closeIconInModal" onClick={onOpenModal} />
          <div className="scrum-new-entery-content">
            <h2 className="add-meeting-title add-meeting-title--create-module">
              {isEdit ? "modify notes" : "view Notes detail"}
            </h2>
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
                isReadOnly={isEdit ? false : true}
              />
            </div>
            {isEdit === false && (
              <div className="row mx-0 align-items-start flex-nowrap">
                <div>
                  <h5 className="font-18-bold font-18-bold--add-scrum mb-30">
                    Date
                  </h5>{" "}
                  <div className="date-picker-common">
                    {/*<h3 className="font-18-bold-space-light-uppercase mb-20">date</h3>*/}

                    <DatePicker
                      minDate={new Date()}
                      selected={values.date}
                      onChange={handleChangeDate}
                      placeholderText="Date"
                      readOnly={isEdit ? false : true}
                    />
                    <div className="datepeacker-date-icon-div">
                      <img
                        src={require("../../../assets/img/icons/new-date-icon.svg")}
                        alt="date"
                      />
                    </div>
                  </div>
                </div>
                <div className="scrum-modal-time-div">
                  <div className="row mx-0 align-items-start">
                    <div className="col-6 pl-0">
                      <h5 className="font-18-bold font-18-bold--add-scrum mb-30">
                        From Time
                      </h5>
                    </div>
                    <div className="col-4">
                      <h5 className="font-18-bold font-18-bold--add-scrum mb-30">
                        To Time
                      </h5>
                    </div>
                  </div>
                  <DatepickerFromToTime
                    //title="Timings"
                    fromTimeValue={values.fromTime}
                    toTimeValue={values.toTime}
                    handleChangeFromTime={handleChangeFromTime}
                    handleChangeToTime={handleChangeToTime}
                    defaultToTime={setHours(setMinutes(new Date(), 0), 10)}
                    placeholderText="Timings"
                    readOnly={isEdit ? false : true}
                  />
                </div>
              </div>
            )}
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
                isDisabled={isEdit ? false : true}
              />
            </div>
            {isEdit ? (
              <div className="text-right">
                <GreenButtonSmallFont
                  text={"Save"}
                  onClick={handleOnClickSave}
                  extraClassName="scrum-modal-btn"
                />
              </div>
            ) : (
              ""
            )}
          </div>
        </Modal>
      </>
    );
  };

  /*=============================================
                  render
============================================*/
  return (
    <div>
      {isEdit ? (
        <button onClick={onOpenModal}>
          <i className="fa fa-pencil"></i>
        </button>
      ) : (
        <>
          <button onClick={onOpenModal}>
            <img
              src={require("../../../assets/img/icons/export-icon.svg")}
              alt="export"
              className="finances-table__export-icon-img"
            />
          </button>
        </>
      )}
      {renderModal()}
    </div>
  );
}
