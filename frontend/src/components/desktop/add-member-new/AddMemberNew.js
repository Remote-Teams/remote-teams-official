import React, { useState, useEffect } from "react";
import LeftNavbar from "../header/LeftNavbar";
import TopNavbar from "../header/TopNavbar";
import PageTitle from "../common/PageTitle";
import BreadcrumbMenu from "../common/BreadcrumbMenu";
import Select from "react-select";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import { setHours, setMinutes } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Checkbox from "rc-checkbox";
import "rc-checkbox/assets/index.css";
import InputFieldPhoneCountryNumber from "../common/InputFieldPhoneCountryNumber";
import DatepickerFromToTime from "../common/DatePickerFromToTime";
import InputFieldNumber from "../common/InputFieldNumber";
import UploadMultipleFiles from "../common/UploadMultipleFiles";
import { useDispatch, useSelector } from "react-redux";
import { getAllUserRoles } from "./../../../store/actions/authAction";
import isEmpty from "../../../store/validations/is-empty";
import { inviteTeamMember } from "./../../../store/actions/resourcesAction";
import { useHistory } from "react-router";
import { getAllCustomFieldsByEntity } from "./../../../store/actions/commandCenterAction";
import { validateAddResource } from "./../../../store/validations/resourceValidation/AddResourceValidation";

const options = [
  { value: "Admin", label: "Admin" },
  { value: "Project manager", label: "Project manager" },
  { value: "Resource", label: "Resource" },
];

const memberTypeOptions = [
  { value: "Full Time Member", label: "Full Time Member" },
  { value: "Freelancer", label: "Freelancer" },
  { value: "Contract Member", label: "Contract Member" },
];

export default function AddMemberNew() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [addMoreDetails, setAddMoreDetails] = useState(false);

  const [values, setValues] = useState({
    fName: "",
    lName: "",
    email: "",
    countryCode: "+1",
    phoneNumber: "",
    accessRole: "",
    dateOfBirth: new Date(),
    dateOfJoining: new Date(),
    memberType: "",
    costOfCompany: "",
    startDate: new Date(),
    endDate: new Date(),
    fromTime: setHours(setMinutes(new Date(), 0), 9),
    toTime: setHours(setMinutes(new Date(), 0), 19),
    checkboxHours: false,
    fileNameCoverImg: "",
    fileName: [],
    fileData: [],
    customTextboxfieldData: {},
    customeDropdownFieldData: {
      // Dropdown: { value: "Facebook", label: "Facebook" },
    },
    memberCustomFields: [],
  });

  const [rolesOption, setRolesOption] = useState([]);

  const [errors, setErrors] = useState({});

  const [allRoles, setAllRoles] = useState([]);

  const allRolesReducer = useSelector((state) => state.auth.allRoles);
  const memberCustomFields = useSelector(
    (state) => state.commandCenter.memberCustomFields
  );

  useEffect(() => {
    dispatch(getAllUserRoles());
    dispatch(getAllCustomFieldsByEntity("MEMBER"));
  }, []);

  useEffect(() => {
    if (!isEmpty(allRolesReducer)) {
      let newArray =
        !isEmpty(allRolesReducer) &&
        allRolesReducer.map((role) => ({
          value: role._id,
          label: role.name,
        }));
      setRolesOption(newArray);
      setAllRoles(allRolesReducer);
    }
  }, [allRolesReducer]);

  useEffect(() => {
    if (!isEmpty(memberCustomFields)) {
      let textBoxData = memberCustomFields.filter(
        (element) => element.type === "TEXTBOX"
      );

      // let dropDownData = leadsCustomFields.filter(
      //   (element) => element.type === "DROPDOWN"
      // );

      let textDataFinalObject = {};
      if (!isEmpty(textBoxData)) {
        textBoxData.forEach((ele) => {
          ele.name = ele.name.split(" ").join("");
          textDataFinalObject[ele.name] = "";
        });
      }

      setValues({
        ...values,
        memberCustomFields: memberCustomFields,
        customTextboxfieldData: textDataFinalObject,
      });
    }
  }, [memberCustomFields]);

  /*=================================================================
      handlers
  =================================================================*/
  const handleAddMoreDetails = () => {
    setAddMoreDetails(!addMoreDetails);
  };
  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
    setErrors({});
  };

  const handleChangeSelectRole = (selectedOption) => {
    setValues({ ...values, accessRole: selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  const handleChangeSelectMemberType = (selectedOption) => {
    setValues({ ...values, memberType: selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  const handleChangeCountryCode = (val) => {
    console.log(val);
    setValues({
      ...values,
      countryCode: val,
    });
  };

  const handleChangeNumber = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.validity.valid ? e.target.value : "",
    });
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

  const handleChangeDateOfJoining = (date) => {
    if (date === null) {
      setValues({
        ...values,
        dateOfJoining: new Date(),
      });
    } else {
      setValues({
        ...values,
        dateOfJoining: date,
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
        checkboxHours: false,
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
        checkboxHours: false,
      });
    }
  };

  const handleCheckboxChange = (e) => {
    console.log(e.target.checked);
    setValues({
      ...values,
      [e.target.id]: e.target.checked,
    });
  };

  const handleOnClickSave = (e) => {
    e.preventDefault();
    // console.log(values);
    const {
      memberCustomFields,
      customTextboxfieldData,
      customeDropdownFieldData,
    } = values;

    const { errors, isValid } = validateAddResource(values);
    if (!isValid) {
      console.log(errors);
      setErrors(errors);
    } else {
      const formData = {
        recipients: [
          {
            email: values.email,
            firstName: values.fName,
            lastName: values.lName,
            profileImage:
              "/public/download?filename=file-2021-08-04T11:30:02.174Z.png",
            additionalInfo: {
              dateOfBirth: values.dateOfBirth.toISOString(),
              country_code: values.countryCode,
            },
            memberType:
              values.memberType.value === "Freelancer"
                ? "FREELANCER"
                : values.memberType.value === "Full Time Member"
                ? "FULLTIME"
                : "CONTRACTUAL",
            phone: values.phoneNumber,
            location: "pune",
            // timezone: "",
            contract: {
              start_date: values.startDate.toISOString(),
              end_date: values.endDate.toISOString(),
              working_hrs_to: values.toTime.toISOString(),
              working_hrs_from: values.fromTime.toISOString(),
              ctc: parseInt(values.costOfCompany),
              attachments: values.fileData,
            },
            demo: false,
            role: values.accessRole.value,
            dateOfJoining: values.dateOfJoining.toISOString(),
            jobTitle: values.accessRole.value,
          },
        ],
      };

      dispatch(
        inviteTeamMember(
          formData,
          memberCustomFields,
          customTextboxfieldData,
          customeDropdownFieldData,
          history
        )
      );
    }
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
    // console.log(fieldData);
    let name = fieldData.name.split(" ").join("");
    return (
      <div className="mr-60">
        <h3 className="font-18-bold color-offwhite">{`${fieldData.name}`}</h3>
        <InputFieldEmailTextPassword
          containerClassName="container-login-flow-input container-login-flow-input--forms mt-50"
          label={`${fieldData.name}`}
          placeholder={`${fieldData.name}`}
          name="billingAddress3"
          value={values.customTextboxfieldData[name]}
          onChange={handleChangeCustomTextBox(name)}
          type="text"
        />
        {/*</div>// <AddLeadsFormField
      //   htmlFor={`${fieldData.name}`}
      //   type={"text"}
      //   labelName={`${fieldData.name}`}
      //   id={`${fieldData.name}`}
      //   name={`${fieldData.name}`}
      //   placeholder={"Eg. India"}
      //   onChange={handleChangeCustomTextBox(name)}
      //   value={values.customTextboxfieldData[name]}
      //   maxLength={maxLengths.char200}
      // />*/}
      </div>
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
    let name = fieldData.name.split(" ").join("");
    let dropdownOption = [];
    fieldData.options.forEach((element) => {
      let obj = { value: element, label: element };
      dropdownOption.push(obj);
    });
    return (
      <div className="mr-60">
        <h3 className="font-18-bold color-offwhite"> {fieldData.name}</h3>
        <Select
          isSearchable={false}
          className="react-select-container react-select-container--addMember mt-50"
          classNamePrefix="react-select-elements"
          value={values.customeDropdownFieldData[name]}
          onChange={onCustomDropdownChange(name)}
          options={dropdownOption}
          placeholder="Select"
        />
      </div>
      // <div className="mb-30">
      //   <label
      //     htmlFor="leadsSource"
      //     className="add-lead-label font-24-semibold"
      //   >
      //     {fieldData.name}
      //   </label>
      //   <div className="add-lead-input-field border-0">

      //     <Select
      //       className="react-select-add-lead-form-container"
      //       classNamePrefix="react-select-add-lead-form"
      //       isSearchable={false}
      //       options={dropdownOption}
      //       value={values.customeDropdownFieldData[name]}
      //       onChange={onCustomDropdownChange(name)}
      //     />
      //   </div>
      // </div>
    );
  };

  /*==================================================
            CUSTOM FIELD SECTION END
  ====================================================*/

  /*=========================================
                      render row 1
  =========================================*/
  const renderRowOne = () => {
    return (
      <div className="row mx-0 align-items-start pt-65">
        <div className="col-3 pl-0">
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms"
            //label="First name"
            placeholder="First name"
            name="fName"
            value={values.fName}
            onChange={handleChange}
            type="text"
            error={!isEmpty(errors.fName) && errors.fName}
          />
        </div>
        <div className="col-3">
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms"
            //label="Last name"
            placeholder="Last name"
            name="lName"
            value={values.lName}
            onChange={handleChange}
            type="text"
            error={!isEmpty(errors.lName) && errors.lName}
          />
        </div>
        <div className="col-3">
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms"
            //label="Email address"
            placeholder="Email address"
            name="email"
            value={values.email}
            onChange={handleChange}
            type="email"
            error={!isEmpty(errors.email) && errors.email}
          />
        </div>
        <div className="col-3">
          <InputFieldPhoneCountryNumber
            containerClassName="container-login-flow-input container-login-flow-input--forms"
            //label="contact number"
            placeholder="contact number"
            name="phoneNumber"
            value={values.phoneNumber}
            countryCode={values.countryCode}
            handleChangeCountryCode={handleChangeCountryCode}
            onChange={handleChangeNumber}
            errorCountryCode={""}
            errorPhone={""}
          />
        </div>
      </div>
    );
  };
  /*==========================================================================
                              render two
   ===========================================================================*/

  const renderRowTwo = () => {
    return (
      <div className="row mx-0 align-items-start add-member-new-row2-div">
        <div className="col-3 pl-0">
          <Select
            className="react-select-container react-select-container--addMember"
            classNamePrefix="react-select-elements"
            value={values.accessRole}
            onChange={handleChangeSelectRole}
            options={rolesOption}
            placeholder="Access role"
            isSearchable={false}
          />
          {errors.accessRole ? (
            <p className="error-message">{errors.accessRole}</p>
          ) : (
            <p className="error-message opacity-0">error</p>
          )}
        </div>
        <div className="col-3">
          <h3 className="font-18-bold color-offwhite">Date of Joining</h3>
          <div className="date-picker-common">
            <DatePicker
              minDate={new Date()}
              selected={values.dateOfJoining}
              onChange={handleChangeDateOfJoining}
              placeholderText="Date of joining"
            />
            <div className={"datepeacker-date-icon-div"}>
              <img
                src={require("../../../assets/img/icons/new-date-icon.svg")}
                alt="date"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  /*===========================================================
                       
               render add more details

===============================================================*/
  const renderAddMoreDetails = () => {
    return (
      <>
        <div className="row mx-0 align-items-start add-member-new-row2-div">
          <div className="col-6 pl-0">
            <h3 className="font-18-bold add-member-new-section-title">
              Employment Type
            </h3>
            <div className="pt-50">
              <Select
                className="react-select-container react-select-container--addMember"
                classNamePrefix="react-select-elements"
                value={values.memberType}
                onChange={handleChangeSelectMemberType}
                options={memberTypeOptions}
                //placeholder="Select"
                placeholder="Member type"
                isSearchable={false}
              />
            </div>
            <div className="add-new-member-cost-div">
              <h3 className="font-18-bold add-member-new-section-title">
                Cost to Company Hours
              </h3>
              <div className="pt-50">
                <InputFieldNumber
                  containerClassName="container-login-flow-input container-login-flow-input--forms"
                  placeholder="cost to company per hour( $ )"
                  name="costOfCompany"
                  value={values.costOfCompany}
                  onChange={handleChangeNumber}
                />
              </div>
            </div>
          </div>
          <div className="col-6">
            <h3 className="font-18-bold add-member-new-section-title">
              Working Hours
            </h3>
            <div className="add-member-new-working-hours-div">
              <div className="login-dashboard-working-hours-block ">
                <DatepickerFromToTime
                  //title="Working hours"
                  fromTimeValue={values.fromTime}
                  toTimeValue={values.toTime}
                  handleChangeFromTime={handleChangeFromTime}
                  handleChangeToTime={handleChangeToTime}
                  defaultToTime={setHours(setMinutes(new Date(), 0), 17)}
                />
              </div>
              {/** customCheckbox--add-member */}
              <div className="customCheckbox">
                <Checkbox
                  id="checkboxHours"
                  onChange={handleCheckboxChange}
                  value={values.checkboxHours}
                  checked={values.checkboxHours}
                  defaultChecked={false}
                />
                <label htmlFor="checkboxHours">
                  <span className="font-14-semibold-italic ml-20 pb-10">
                    Use Default Company Hours
                  </span>
                </label>
              </div>
            </div>
            <div className="w-100">{renderUploadMultipleFiles()}</div>
            {/*!isEmpty(values.memberCustomFields) ? (
              <h5 className="font-21-medium mt-5">Custom Fields</h5>
            ) : (
              ""
            )}
            {!isEmpty(values.memberCustomFields) &&
              values.memberCustomFields.map((data, index) => {
                if (data.type === "TEXTBOX") {
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
              })*/}
          </div>
        </div>
        <div className="col-3">
          <h3 className="font-18-bold color-offwhite">Date of Birth</h3>
          <div className="date-picker-common">
            <DatePicker
              minDate={new Date()}
              selected={values.dateOfBirth}
              onChange={handleChangeDate}
              placeholderText="Date of birth"
            />
            <div className={"datepeacker-date-icon-div"}>
              <img
                src={require("../../../assets/img/icons/new-date-icon.svg")}
                alt="date"
              />
            </div>
          </div>
        </div>
        {!isEmpty(values.memberCustomFields) ? (
          <h5 className="font-21-medium mt-5">Custom Fields</h5>
        ) : (
          ""
        )}
        <div className="row mx-0 align-items-start">
          {!isEmpty(values.memberCustomFields) &&
            values.memberCustomFields.map((data, index) => {
              if (data.type === "TEXTBOX") {
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
            })}{" "}
        </div>
      </>
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
      <div className="add-member-new-attach-document-div">
        <h3 className="font-18-bold add-member-new-section-title">
          Attach Document
        </h3>
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

  return (
    <div>
      {/* left navbar */}
      <LeftNavbar activeMenu="members" />
      <div className="main-page-padding">
        {/* pagetitle and topnavbar */}
        <div className="pageTitle-topNavbar-div">
          <PageTitle title="Members" />
          <TopNavbar />
        </div>

        <BreadcrumbMenu
          menuObj={[
            {
              title: "Members",
              link: "/scheduler-two",
              //link: "/resources",
            },
            {
              title: "Add New Member",
            },
          ]}
        />
        <div className="pt-50">
          <h1 className="add-new-member-title ">Add New Member </h1>
          {renderRowOne()}
          {renderRowTwo()}
          {addMoreDetails ? (
            <button
              onClick={handleAddMoreDetails}
              className="new-add-member-add-more-btn"
            >
              <img
                src={require("../../../assets/img/icons/add-more-details-icon.png")}
                alt=""
              />
              <span className="new-add-member-add-more-btn-span-text">
                Add more details
              </span>
              <span className="new-add-member-add-more-btn__arrows-txet">
                <i className="fa fa-chevron-up" />
              </span>
            </button>
          ) : (
            <button
              onClick={handleAddMoreDetails}
              className="new-add-member-add-more-btn"
            >
              <img
                src={require("../../../assets/img/icons/add-more-details-icon.png")}
                alt=""
              />
              <span className="new-add-member-add-more-btn-span-text">
                Add more details
              </span>
              <span className="new-add-member-add-more-btn__arrows-txet">
                <i className="fa fa-chevron-down" />
              </span>
              {/*<div className="new-add-member-add-more-arrow"></div>*/}
            </button>
          )}

          {addMoreDetails ? renderAddMoreDetails() : ""}
        </div>

        <GreenButtonSmallFont
          text={"Save & Add"}
          onClick={handleOnClickSave}
          extraClassName="mt-20"
        />
      </div>
    </div>
  );
}
