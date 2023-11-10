import React, { useState, useEffect } from "react";
import Modal from "react-responsive-modal";
import InputFieldEmailTextPassword from "./../../desktop/common/InputFieldEmailTextPassword";
import GreenButtonSmallFont from "./../common/GreenButtonSmallFont";
import GrayButtonSmallFont from "./../common/GrayButtonSmallFont";
import DatePickerFromToDate from "./../common/DatePickerFromToDate";
import DatePickerFromToTime from "./../common/DatePickerFromToTime";
import { setHours, setMinutes } from "date-fns";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputFieldNumber from "../common/InputFieldNumber";
import { Fragment } from "react";
import Select from "react-select";
import UploadMultipleFilesListDisplay from "../common/UploadMultipleFilesListDisplay";
import UploadMultipleFiles from "../common/UploadMultipleFiles";
import { useDispatch, useSelector } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import { updateResourceAction } from "./../../../store/actions/resourcesAction";
import {
  getAllFieldsValue,
  getAllCustomFieldsByEntity,
} from "./../../../store/actions/commandCenterAction";
import displaySmallText from "./../../../store/utils/sliceString";

const dummyData = [1, 2];

const memberTypeOptions = [
  { value: "Full Time Member", label: "Full Time Member" },
  { value: "Freelancer", label: "Freelancer" },
  { value: "Contract Member", label: "Contract Member" },
];

const customOptions = [
  { value: "Custom Fields 1", label: "Custom Fields 1" },
  { value: "Custom Fields 2", label: "Custom Fields 2" },
  { value: "Custom Fields 3", label: "Custom Fields 3" },
];

export default function MemberDetailsNew() {
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  const [values, setValues] = useState({
    open: false,
    startDate: "",
    endtDate: "",
    fromTime: setHours(setMinutes(new Date(), 0), 10),
    toTime: setHours(setMinutes(new Date(), 0), 11),
    dateOfBirth: "",
    location: "",
    phoneNumber: "",
    cost: "",
    memberType: "",
    fileName: [],
    fileData: [],
    customFieldsSelected: "",
    customFields: "",
    memberCustomFields: [],
    customTextboxfieldData: {},
    customeDropdownFieldData: {},
  });

  const [resourceData, setResourceData] = useState({});

  const singleResourceData = useSelector(
    (state) => state.resources.singleResourceData
  );

  useEffect(() => {
    if (!isEmpty(singleResourceData)) {
      setValues({
        ...values,
        dateOfBirth: !isEmpty(singleResourceData.additionalInfo.dateOfBirth)
          ? new Date(singleResourceData.additionalInfo.dateOfBirth)
          : "",
        location: !isEmpty(singleResourceData.location)
          ? singleResourceData.location
          : "",
        phoneNumber: singleResourceData.phone,
        cost: singleResourceData.contract.ctc,
        startDate: !isEmpty(singleResourceData.contract.start_date)
          ? new Date(singleResourceData.contract.start_date)
          : "",
        endtDate: !isEmpty(singleResourceData.contract.end_date)
          ? new Date(singleResourceData.contract.end_date)
          : "",
        fromTime: !isEmpty(singleResourceData.contract.working_hrs_from)
          ? new Date(singleResourceData.contract.working_hrs_from)
          : setHours(setMinutes(new Date(), 0), 10),
        toTime: !isEmpty(singleResourceData.contract.working_hrs_to)
          ? new Date(singleResourceData.contract.working_hrs_to)
          : setHours(setMinutes(new Date(), 0), 11),
        memberType:
          singleResourceData.memberType === "CONTRACTUAL"
            ? memberTypeOptions[2]
            : singleResourceData.memberType === "FULLTIME"
            ? memberTypeOptions[0]
            : memberTypeOptions[1],
        fileName: isEmpty(singleResourceData.contract.attachments)
          ? []
          : singleResourceData.contract.attachments.map(
              (doc) => doc.originalname
            ),
        fileData: isEmpty(singleResourceData.contract.attachments)
          ? []
          : singleResourceData.contract.attachments,
      });
      setResourceData(singleResourceData);
      dispatch(
        getAllFieldsValue({
          entity_Id: singleResourceData._id,
        })
      );
      // dispatch(getAllCustomFieldsByEntity("MEMBER"));
    }
  }, [singleResourceData]);

  const allFieldsValue = useSelector(
    (state) => state.commandCenter.allFieldsValue
  );

  useEffect(() => {
    if (!isEmpty(allFieldsValue)) {
      let textDataFinalObject = {};
      let dropdownDataFinalObject = {};
      allFieldsValue.forEach((ele) => {
        console.log(ele);
        if (ele.fieldData.type === "TEXTBOX") {
          ele.fieldData.name = ele.fieldData.name.split(" ").join("");
          textDataFinalObject[ele.fieldData.name] = ele.value;
        } else {
          ele.fieldData.name = ele.fieldData.name.split(" ").join("");
          dropdownDataFinalObject[ele.fieldData.name] = {
            value: ele.value,
            label: ele.value,
          };
        }
      });

      setValues({
        ...values,
        memberCustomFields: allFieldsValue,
        customTextboxfieldData: textDataFinalObject,
        customeDropdownFieldData: dropdownDataFinalObject,
      });
    } else {
      setValues({
        ...values,
        memberCustomFields: [],
        customTextboxfieldData: {},
        customeDropdownFieldData: {},
      });
    }
  }, [allFieldsValue]);

  /*===============================================
               handler
===============================================*/
  const editButtonText = (
    <>
      <img
        src={require("../../../assets/img/icons/dashboard-to-do-edit-icon.svg")}
        alt="edit"
      />
      <span>Edit Details</span>
    </>
  );

  //const saveButtonText = (
  //  <>
  //    <img
  //      src={require("../../../assets/img/icons/dashboard-to-do-save-icon.svg")}
  //      alt="save"
  //    />
  //    <span>Save Details</span>
  //  </>
  //);}
  const onOpenModal = () => {
    setValues({ ...values, open: true });
  };

  const onCloseModal = () => {
    setValues({ ...values, open: false });
    setEdit(false);
  };

  const handleOnEdit = () => {
    setEdit(!edit);
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  //  const handleChangeStart = (date) => {
  //    if (date === null) {
  //      setValues({
  //        ...values,
  //        startDate: new Date(),
  //      });
  //    } else {
  //      setValues({
  //        ...values,
  //        startDate: date,
  //      });
  //    }
  //  };

  //  const handleChangeEnd = (date) => {
  //    if (date === null) {
  //      setValues({
  //        ...values,
  //        endDate: new Date(),
  //      });
  //    } else {
  //      setValues({
  //        ...values,
  //        endDate: date,
  //      });
  //    }
  //  };

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

  const handleChangeDate = (date) => {
    if (date === null) {
      setValues({
        ...values,
        dateOfBirth: new Date(),
      });
    } else {
      setValues({
        ...values,
        dateOfBirth: date,
      });
    }
  };

  const handleChangeNumber = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.validity.valid ? e.target.value : "",
    });
  };

  const handleChangeSelectMemberType = (selectedOption) => {
    setValues({ ...values, memberType: selectedOption });
    console.log(`Option selected:`, selectedOption);
  };
  const handleCustomeDropdownChange = (selectedOption) => {
    setValues({ ...values, customFieldsSelected: selectedOption });
    console.log(`Option selected:`, selectedOption);
  };
  const handleOnClickDocumentName = () => {
    console.log("onclick file");
  };

  const callBackUpdateResource = (status) => {
    if (status === 200) {
      onCloseModal();
    }
  };

  const handleOnSave = (e) => {
    e.preventDefault();
    console.log(values);
    const {
      customTextboxfieldData,
      customeDropdownFieldData,
      memberCustomFields,
    } = values;

    let formData = singleResourceData;
    // formData.firstName = values.fname;
    // formData.lastName = values.lname;
    // formData.lastName = values.lname;
    // formData.email = values.emailAddress;
    formData.location = values.location;
    formData.phone = values.phoneNumber;
    // formData.additionalInfo.country_code = values.countryCode;
    formData.additionalInfo.dateOfBirth = values.dateOfBirth
      ? values.dateOfBirth.toISOString()
      : "";
    formData.contract.ctc = values.cost;
    formData.contract.working_hrs_from = values.fromTime
      ? values.fromTime.toISOString()
      : "";
    formData.contract.working_hrs_to = values.toTime
      ? values.toTime.toISOString()
      : "";
    // formData.contract.start_date = values.startDate.toISOString();
    // formData.contract.end_date = values.endDate.toISOString();
    formData.memberType =
      values.memberType.value === "Freelancer"
        ? "FREELANCER"
        : values.memberType.value === "Full Time Member"
        ? "FULLTIME"
        : "CONTRACTUAL";
    formData.contract.attachments = values.fileData;
    dispatch(
      updateResourceAction(
        formData._id,
        formData,
        customTextboxfieldData,
        customeDropdownFieldData,
        memberCustomFields,
        callBackUpdateResource
      )
    );
  };

  /*==================================================
            CUSTOM FIELD SECTION START
  ====================================================*/

  // CUSTOM TEXTBOX SECTION

  const handleChangeCustomTextBox = (name) => (e) => {
    let prevFieldData = values.customTextboxfieldData;
    prevFieldData[name] = e.target.value;
    setValues({
      ...values,
      customTextboxfieldData: prevFieldData,
    });
  };

  const renderCustomTextbox = (fieldData) => {
    let name = fieldData.fieldData.name.split(" ").join("");
    return (
      <>
        <h3 className="font-18-bold color-offwhite">
          {fieldData.fieldData.name}
        </h3>
        <InputFieldEmailTextPassword
          containerClassName="container-login-flow-input container-login-flow-input--forms"
          label={`${fieldData.fieldData.name}`}
          placeholder={`${fieldData.fieldData.name}`}
          name="billingAddress3"
          value={values.customTextboxfieldData[name]}
          onChange={handleChangeCustomTextBox(name)}
          type="text"
        />
      </>
    );
  };

  // CUSTOM DROPDOWN SECTION

  const onCustomDropdownChange = (name) => (e) => {
    let prevFieldData = values.customeDropdownFieldData;
    prevFieldData[name] = { value: e.value, label: e.value };
    setValues({
      ...values,
      customeDropdownFieldData: prevFieldData,
    });
    // console.log("Selected: " + e.value, name);
  };

  const renderCustomDropdown = (fieldData) => {
    // console.log(fieldData);
    let name = fieldData.fieldData.name.split(" ").join("");
    let dropdownOption = [];
    fieldData.fieldData.options.forEach((element) => {
      let obj = { value: element, label: element };
      dropdownOption.push(obj);
    });
    return (
      <div className="col-5">
        <h3 className="font-18-bold color-offwhite">
          {" "}
          {fieldData.fieldData.name}
        </h3>
        <Select
          isSearchable={false}
          className="react-select-container react-select-container--addMember mt-20"
          classNamePrefix="react-select-elements"
          value={values.customeDropdownFieldData[name]}
          onChange={onCustomDropdownChange(name)}
          options={dropdownOption}
          placeholder="Select"
        />
      </div>
    );
  };

  /*==================================================
            CUSTOM FIELD SECTION END
  ====================================================*/

  /*============================================================
                        renderRowOne
============================================================*/
  const renderRowOne = () => {
    return (
      <div className="row mx-0 align-items-start members-details-new-row-1-div">
        <div className="members-details-new-profile-img-div">
          <img
            // src={`${resourceData.profileImage}&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjQ2M2RkODUwLTk4M2MtMTFlYi04YjhjLWQxNTRlNDIxMzFlNSIsImVtYWlsIjoiYWtzaGF5bmFnYXJnb2plMDcxNkBnbWFpbC5jb20iLCJ3b3Jrc3BhY2VJZCI6ImRlbW8zMDIifSwic3ViIjoiU3lzdGVtX1Rva2VuIiwiaXNzIjoiZG9taW5hdGUuYWkiLCJhdWQiOiJkb21pbmF0ZWFkbWluQGRvbWluYXRlLmFpIiwiaWF0IjoxNjE4NDc4NzEwLCJleHAiOjE2Mzg0Nzg3MTB9.-appa9PXDxbpFSOeNzeZYEZkTI3DGfBBlxaPZkHZDBs`}
            src={require("../../../assets/img/dummy/new-profile-without-border.png")}
            alt="member"
          />
        </div>
        <div>
          <h3 className="members-details-new-member-name">
            {resourceData.name}
          </h3>
          <h4 className="members-details-new-member-email font-18-bold">
            {resourceData.email}
          </h4>
          <h5 className="members-details-new-member-status font-18-italic">
            <span>
              <i className="fa fa-circle" />
            </span>
            Available
          </h5>
          {edit ? (
            <>
              {/*<GrayButtonSmallFont
              extraClassName="member-details-new-edit-btn"
              text={saveButtonText}
              onClick={handleOnSave}
            >*/}
            </>
          ) : (
            <GrayButtonSmallFont
              extraClassName="member-details-new-edit-btn"
              text={editButtonText}
              onClick={handleOnEdit}
            />
          )}
        </div>
      </div>
    );
  };
  /*===========================================================================
        renderUploadMultipleFiles
  ============================================================================*/

  const handleOnChangeUploadDocuments = (e) => {
    e.preventDefault();
    // upload exact file to server
    const data = new FormData();
    data.append("file", e.target.files[0]);

    //display multiple file name in front end
    let files = values.fileName;
    files.push(e.target.files[0].name);
    setValues({
      ...values,
      fileName: files,
    });
  };

  const handleOnClickRemoveDocument = (val) => (e) => {
    e.preventDefault();
    const { fileName, fileData } = values;
    const filteredItems = fileName.filter((item) => item !== val);
    const filteredFileData = fileData.filter(
      (item) => item.originalname !== val
    );
    setValues({
      ...values,
      fileName: filteredItems,
      fileData: filteredFileData,
    });
  };

  const renderUploadMultipleFiles = () => {
    return (
      <div>
        <UploadMultipleFiles
          containerClassName="upload-img__mainBlock upload-img__mainBlock--new-client mt-40"
          //buttonName="+ New Doc"
          buttonName="Choose files"
          fileNameValue={values.fileName}
          // acceptType="image/jpeg, image/png"
          onChange={handleOnChangeUploadDocuments}
          handleOnClickRemoveDocument={handleOnClickRemoveDocument}
        />
      </div>
    );
  };

  /*====================================================
                    renderProfileTab
 =====================================================*/
  const renderProfileTab = () => {
    return (
      <div className="member-details-new-work-tabpanel-div">
        <div className="row mx-0 align-items-start">
          <div className="col-4 pl-0">
            <div>
              <h3 className="font-18-bold color-offwhite">Date of Birth</h3>
              <div className="date-picker-common mt-40">
                <DatePicker
                  minDate={new Date()}
                  selected={values.dateOfBirth}
                  onChange={handleChangeDate}
                  placeholderText="Date of birth"
                  readOnly={edit ? false : true}
                />
              </div>
            </div>
          </div>
          <div className="col-4">
            <h3 className="font-18-bold color-offwhite">Location</h3>
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--member-new-detail container-login-flow-input--forms mt-40"
              placeholder="Add Location"
              name="location"
              value={values.location}
              onChange={handleChange}
              type="text"
              isReadOnly={edit ? false : true}
            />
          </div>
          <div className="col-4">
            <h3 className="font-18-bold color-offwhite">Phone Number</h3>
            <InputFieldNumber
              containerClassName="container-login-flow-input container-login-flow-input--member-new-detail container-login-flow-input--forms mt-40"
              placeholder="Add Phone Number"
              name="phoneNumber"
              value={values.phoneNumber}
              onChange={handleChangeNumber}
              isReadOnly={edit ? false : true}
            />
          </div>
        </div>
        <h5 className="font-18-bold member-details-new-assigned mt-30">
          Assigned to Projects
        </h5>
        <div className="row mx-0 mt-30">
          {!isEmpty(resourceData) &&
            resourceData.projects.map((data, index) => (
              <div key={index} className="member-details-new-project-outer-div">
                <div className="row mx-0 align-items-center justify-content-center member-details-new-project-div">
                  <img
                    src={require("../../../assets/img/dashboard/dashboard-bag-icon.svg")}
                    alt=""
                    className="member-details-new-project-img"
                  />
                  <h5 className="member-details-new-project-name">
                    {displaySmallText(data.name, 10, true)}
                  </h5>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  };
  /*==================================================================
                  renderWorkTab
  ==================================================================*/
  const renderWorkTab = () => {
    return (
      <div className="member-details-new-work-tabpanel-div">
        <div className="row mx-0 align-items-start">
          <div className="member-details-new-memberType-div">
            <h3 className="font-18-bold color-offwhite">Member Type</h3>
            <Select
              className="react-select-container react-select-container--addMember react-select-container--member-details mt-30"
              classNamePrefix="react-select-elements"
              value={values.memberType}
              onChange={handleChangeSelectMemberType}
              options={memberTypeOptions}
              //placeholder="Select"
              placeholder="Add Member type"
              isSearchable={false}
              isDisabled={edit ? false : true}
            />
          </div>
          {/*<div className="member-details-new-datepicker">
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
              isDisabledStartDate={edit ? false : true}
              isDisabledEndDate={edit ? false : true}
            />
           </div>*/}
        </div>
        <div>
          <h5 className="font-18-bold color-offwhite mt-40">Working Hours</h5>
          <div className="member-details-new-datepicker mt-40">
            <DatePickerFromToTime
              //title="Working hours"
              fromTimeValue={values.fromTime}
              toTimeValue={values.toTime}
              handleChangeFromTime={handleChangeFromTime}
              handleChangeToTime={handleChangeToTime}
              defaultToTime={setHours(setMinutes(new Date(), 0), 17)}
              readOnly={edit ? false : true}
            />
          </div>
        </div>
        <div>
          <h5 className="font-18-bold color-offwhite mt-40">
            Cost to Company Hours
          </h5>
          <div className="pt-50">
            <InputFieldNumber
              containerClassName="container-login-flow-input container-login-flow-input--member-new-detail container-login-flow-input--forms"
              placeholder="cost to company per hour( $ )"
              name="cost"
              value={values.cost}
              onChange={handleChangeNumber}
              isReadOnly={edit ? false : true}
            />
          </div>
        </div>
        <div>
          <h5 className="font-18-bold color-offwhite mt-40">
            Attach Documents
          </h5>

          {edit ? (
            <div> {renderUploadMultipleFiles()}</div>
          ) : (
            <div className="mt-40">
              <UploadMultipleFilesListDisplay
                dataDocuments={values.fileData}
                handleOnClickDocumentName={handleOnClickDocumentName}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  /*=========================================================
                        renderCustomFields
  ==========================================================*/

  const renderCustomTab = () => {
    if (!isEmpty(allFieldsValue)) {
      return allFieldsValue.map((data, index) => {
        return (
          <Fragment key={index}>
            <h3 className="font-18-bold color-offwhite">
              {data.fieldData.name}
            </h3>
            <div className="row mx-0 align-items-start mt-20">
              <div className="col-5 pl-0">
                <InputFieldEmailTextPassword
                  containerClassName="container-login-flow-input container-login-flow-input--forms"
                  //label="shipping address line 3"
                  name="customFields"
                  value={data.value}
                  // onChange={this.handleChange}
                  type="text"
                  placeholder={"Custom Fields"}
                  isReadOnly={true}
                />
              </div>
            </div>
          </Fragment>
        );
      });
    }
  };

  const renderCustomEditTab = () => {
    const { memberCustomFields } = values;
    if (!isEmpty(allFieldsValue)) {
      return allFieldsValue.map((data, index) => {
        if (data.fieldData.type === "TEXTBOX") {
          return (
            <div key={index} className="mt-5">
              {renderCustomTextbox(data)}
            </div>
          );
        } else {
          return (
            <div key={index} className="mt-5">
              {renderCustomDropdown(data)}
            </div>
          );
        }
      });
    }
  };

  /*=========================================================
                        render
  ==========================================================*/
  return (
    <div>
      <button
        onClick={onOpenModal}
        className="scheduler-view-members-details-btn"
      >
        {!isEmpty(singleResourceData) && `${singleResourceData.firstName}'s`}{" "}
        Details
      </button>
      <Modal
        open={values.open}
        onClose={onCloseModal}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--scheduler-new-member-details",
          closeButton: "customCloseButton",
        }}
      >
        {/* close modal */}
        <span className="closeIconInModal" onClick={onCloseModal} />
        <div className="member-details-new-div">
          {renderRowOne()}
          <div className="profile_tabs_section profile_tabs_section--member-details-new">
            <Tabs>
              <TabList>
                <Tab>Profile</Tab>
                <Tab>Work</Tab>
                {!isEmpty(allFieldsValue) && <Tab>Custom Fields</Tab>}
              </TabList>
              <TabPanel>{renderProfileTab()}</TabPanel>
              <TabPanel>{renderWorkTab()}</TabPanel>
              {!isEmpty(allFieldsValue) && (
                <TabPanel>
                  {edit === false ? renderCustomTab() : renderCustomEditTab()}
                </TabPanel>
              )}
            </Tabs>
            <div className="pt-10 text-right">
              {edit ? (
                <GreenButtonSmallFont
                  text={"Save Changes"}
                  onClick={handleOnSave}
                  extraClassName="member-details-new-save-from-btn"
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
