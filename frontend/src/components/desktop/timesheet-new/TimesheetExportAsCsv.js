import React, { useState, useEffect, useRef } from "react";
import Modal from "react-responsive-modal";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import DatePickerFromToDate from "./../common/DatePickerFromToDate";
import { useDispatch, useSelector } from "react-redux";
import { AllTimesheetDataExport } from "./../../../store/actions/timesheetAction";
import isEmpty from "../../../store/validations/is-empty";
import { startOfDay, endOfDay } from "date-fns";
import { CSVLink } from "react-csv";
import Toast from "light-toast";

export default function TimesheetExportAsCsv() {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    open: false,
    startDate: new Date(),
    endDate: new Date(),
  });

  const [csvData, setcsvData] = useState([]);

  const csvLinkEl = React.useRef();

  const allExportTimesheetData = useSelector(
    (state) => state.timesheet.allExportTimesheetData
  );

  useEffect(() => {
    if (!isEmpty(allExportTimesheetData)) {
      setValues({
        ...values,
        csvData: allExportTimesheetData.data,
      });
    }
  }, [allExportTimesheetData]);

  /*===========================================================
    
                            handler

    ============================================================*/
  const onOpenModal = () => {
    setValues({ ...values, open: true });
  };

  const onCloseModal = () => {
    setValues({ ...values, open: false });
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

  // downloadReport = async () => {
  //   const data = await this.getUserList();
  //   this.setState({ data: data }, () => {
  //     setTimeout(() => {
  //       this.csvLinkEl.current.link.click();
  //     });
  //   });
  // };

  const callback = (data) => {
    // console.log(data.data);
    setcsvData(data.data);
    onCloseModal();
    Toast.info("Data Exported", 3000);
    csvLinkEl.current.link.click();
  };

  const handleSave = async (e) => {
    e.preventDefault();

    var userData = JSON.parse(localStorage.getItem("UserData"));
    // console.log(values);
    const monthViewData = {
      startDate: startOfDay(values.startDate).toISOString(),
      endDate: endOfDay(values.endDate).toISOString(),
      member: userData.id,
    };

    // csvLinkEl.current.link.click();

    dispatch(AllTimesheetDataExport(monthViewData, callback));
  };

  return (
    <div>
      <GrayButtonSmallFont
        extraClassName="timesheet-export-as-csv-btn"
        onClick={onOpenModal}
        text={
          <>
            <img src="/img/icons/white-export-icon.svg" alt="export" />
            Export as csv
          </>
        }
      />

      <Modal
        open={values.open}
        onClose={onCloseModal}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--timesheet-export-as-csv",
          closeButton: "customCloseButton",
        }}
      >
        {/* close modal */}
        <span className="closeIconInModal" onClick={onCloseModal} />
        <h1 className="add-new-custom-fields-title">Export Timesheet as Csv</h1>
        <div className="timesheet-export-csv-select-range-div">
          <h5 className="timesheet-export-csv-select-range-text">
            Select Time Range
          </h5>
          <div className="timesheet-export-csv-date-picker">
            {/*this input use for datepicker autoFoucs false / datepicker calendar do not focus on load */}
            <input className="timesheet-export-csv-input" autoFocus />
            <DatePickerFromToDate
              //labelStart="Start Date"
              placeholderStart="Start Date"
              startDateValue={values.startDate}
              //labelEnd={labelEndDate}
              placeholderEnd="End Date"
              endDateValue={values.endDate}
              handleChangeStart={handleChangeStart}
              handleChangeEnd={handleChangeEnd}
              //error={errors}
            />
          </div>
        </div>
        <div className="text-center">
          <GreenButtonSmallFont
            text={"Export"}
            onClick={handleSave}
            extraClassName={"timesheet-new-export-csv-btn"}
          />
          <CSVLink filename="Timesheet.csv" data={csvData} ref={csvLinkEl} />
        </div>
      </Modal>
    </div>
  );
}
