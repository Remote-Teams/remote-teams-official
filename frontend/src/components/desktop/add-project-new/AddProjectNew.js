import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LeftNavbar from "../header/LeftNavbar";
import TopNavbar from "../header/TopNavbar";
import PageTitle from "../common/PageTitle";
import BreadcrumbMenu from "../common/BreadcrumbMenu";
import Select from "react-select";
import TaskMemberDisplayList from "../common/TaskMemberDisplayList";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import InputFieldNumber from "../common/InputFieldNumber";
import DatePickerFromToDate from "../common/DatePickerFromToDate";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import isEmpty from "../../../store/validations/is-empty";
import { coverImageOptions } from "./coverImageOptions";
import { useDispatch, useSelector } from "react-redux";
import { createNewProject } from "./../../../store/actions/projectAction";
import { getAllClients } from "./../../../store/actions/clientAction";
import { getAllResourceAction } from "./../../../store/actions/resourcesAction";
import { useHistory } from "react-router";
import { startOfMonth, endOfMonth } from "date-fns";
import { getAllCustomFieldsByEntity } from "./../../../store/actions/commandCenterAction";
import EditorQuillCommon from "../common/EditorQuillCommon";
import { validateAddProject } from "./../../../store/validations/projectValidation/AddProjectValidation";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";

// const clientOption = [
//   { value: "Client1", label: "Client1" },
//   { value: "Client2", label: "Client2" },
//   { value: "Client3", label: "Client3" },
//   { value: "Client4", label: "Client4" },
// ];

export default function AddProjectNew({ isEdit }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isAddMoreDetail, setIsAddMoreDetail] = useState(false);

  const [values, setValues] = useState({
    selectOption: "",
    displayListSelected: [],

    projectName: "",
    tagName: "",
    estimateCost: "",
    estimateHour: "",
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
    client: "",
    selectedCoverImage: "",
    tagEntered: "",
    tagsEnteredList: [],
    errors: {},
    customTextboxfieldData: {},
    customeDropdownFieldData: {
      // Dropdown: { value: "Facebook", label: "Facebook" },
    },
    projectCustomFields: [],
    editorQuillTextValue: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getAllClients());
    dispatch(getAllResourceAction());
    dispatch(getAllCustomFieldsByEntity("PROJECT"));
  }, []);

  const [clientOption, setclientOption] = useState([]);
  const [options, setoptions] = useState([]);

  const allClients = useSelector((state) => state.client.allClients);
  const allResources = useSelector((state) => state.resources.allResources);

  useEffect(() => {
    if (!isEmpty(allClients)) {
      let newArray =
        !isEmpty(allClients) &&
        allClients.map((client) => ({
          value: client._id,
          label: client.name,
        }));

      setclientOption(newArray);
    }
  }, [allClients]);

  useEffect(() => {
    var userData = JSON.parse(localStorage.getItem("UserData"));
    if (!isEmpty(allResources)) {
      let newArray =
        !isEmpty(allResources) &&
        allResources.map((client) => ({
          value: client._id,
          label: client.name,
        }));

      let filteredArray =
        !isEmpty(newArray) &&
        newArray.filter((ele) => ele.value === userData.id);

      setoptions(newArray);
      setValues({
        ...values,
        displayListSelected: [filteredArray[0]],
        selectOption: filteredArray[0],
      });
    }
  }, [allResources]);

  const projectCustomFields = useSelector(
    (state) => state.commandCenter.projectCustomFields
  );

  useEffect(() => {
    if (!isEmpty(projectCustomFields)) {
      let textBoxData = projectCustomFields.filter(
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
        projectCustomFields: projectCustomFields,
        customTextboxfieldData: textDataFinalObject,
      });
    }
  }, [projectCustomFields]);

  /*===============================================================================
      handlers
  ===============================================================================*/

  const handleOnChangeEditor = (editor) => {
    setValues({
      ...values,
      editorQuillTextValue: editor.getHTML(),
    });
    // console.log(editor.getHTML());
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
    setErrors({});
  };

  const handleChangeNumber = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.validity.valid ? e.target.value : "",
      // errors: {},
    });
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

  const handleChangeClient = (selectedOption) => {
    setValues({
      ...values,
      client: selectedOption,
    });
  };
  const handleAddMoreDetail = () => {
    setIsAddMoreDetail(!isAddMoreDetail);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const {
      projectCustomFields,
      customTextboxfieldData,
      customeDropdownFieldData,
    } = values;

    const { errors, isValid } = validateAddProject(values);

    if (!isValid) {
      setErrors(errors);
    } else {
      let newArray = [];

      if (!isEmpty(values.displayListSelected)) {
        let data = values.displayListSelected.map((member) => member.value);
        newArray = data;
      }
      const formData = {
        name: values.projectName,
        client: values.client.value,
        logo: values.selectedCoverImage,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        estimatedCTC: parseInt(values.estimateCost),
        estimatedHours: parseInt(values.estimateHour),
        description: values.editorQuillTextValue,
        resources: newArray,
        status: "UPCOMING",
        tags: values.tagsEnteredList,
      };

      dispatch(
        createNewProject(
          formData,
          projectCustomFields,
          customTextboxfieldData,
          customeDropdownFieldData,
          history
        )
      );
    }
    // console.log(values);
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
        {/*// <AddLeadsFormField
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

  /*===============================================================================
      renderAddMoreDetails
  ===============================================================================*/
  const handleChangeSelectClient = (selectedOption) => {
    let newList = values.displayListSelected;
    if (newList.indexOf(selectedOption) === -1) {
      newList.push(selectedOption);
      setValues({
        ...values,
        selectOption: selectedOption,
        displayListSelected: newList,
      });
    } else {
      setValues({
        ...values,
        selectOption: selectedOption,
      });
    }
  };

  const handleRemoveMember = (index) => (e) => {
    let newList = values.displayListSelected;
    newList.splice(index, 1);
    setValues({
      ...values,
      displayListSelected: newList,
      selectOption: "",
    });
  };

  const renderSelectMembers = () => {
    return (
      <>
        <h5 className="font-18-bold color-offwhite">Select Members</h5>
        <Select
          className="react-select-container mt-30 mb-40 react-select-container--addMember react-select-container--add-new-project react-select-container--addMember--selectMember"
          classNamePrefix="react-select-elements"
          value={values.selectOption}
          onChange={handleChangeSelectClient}
          options={options}
          isSearchable={false}
          placeholder="Select Members"
        />

        <h4 className="font-18-bold color-offwhite mb-30">Selected members</h4>
        {!isEmpty(values.displayListSelected) && (
          <>
            <div className="add-project-new-selected-member-display-list-div mb-20">
              <TaskMemberDisplayList
                displayListSelected={values.displayListSelected}
                handleRemoveMember={handleRemoveMember}
              />
            </div>
          </>
        )}
      </>
    );
  };

  /*===============================================================================
      renderAddCoverImage
  ===============================================================================*/

  const [
    displayCoverImageOptionBlock,
    setDisplayCoverImageOptionBlock,
  ] = useState(false);

  const hideCoverImageOptions = () => {
    setDisplayCoverImageOptionBlock(false);
    document.removeEventListener("click", hideCoverImageOptions);
  };

  const handleOnClickAddCoverImage = () => {
    setDisplayCoverImageOptionBlock(true);
    document.addEventListener("click", hideCoverImageOptions);
  };

  const handleOnClickSelectCoverImage = (data) => (e) => {
    if (values.selectedCoverImage !== data.img) {
      setValues({
        ...values,
        selectedCoverImage: data.img,
      });
    }
  };

  const renderAddCoverImage = () => {
    return (
      <div className="add-project-add-cover-image-main-block">
        {isEmpty(values.selectedCoverImage) ? (
          <button
            className="add-project-new-add-cover-img-btn"
            onClick={handleOnClickAddCoverImage}
          >
            <span className="font-14-bold color-white-48">
              + Add Cover Image
            </span>
          </button>
        ) : (
          <button
            className="add-project-new-add-cover-img-btn add-project-new-add-cover-img-btn--img"
            onClick={handleOnClickAddCoverImage}
          >
            <img src={values.selectedCoverImage} alt="" />
          </button>
        )}
        {displayCoverImageOptionBlock && (
          <div className="add-project-new-default-cover-img-options-block">
            <h4 className="add-project-select-cover-img-text mb-30">
              Select Cover Image
            </h4>
            <div className="row mx-0 align-items-start add-project-new-default-cover-img-options-block__overflowBlock">
              {coverImageOptions.map((data, index) => (
                <button
                  key={index}
                  className="add-project-new-default-cover-img-options-block__imgBlock"
                  onClick={handleOnClickSelectCoverImage(data)}
                >
                  <img src={data.img} alt="" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  /*===============================================================================
      renderTagsBlock
  ===============================================================================*/
  const handleChangeEnterTags = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnKeyDownEnterTags = (e) => {
    let isExist = values.tagsEnteredList.includes(e.target.value);
    let newTagsList = [...values.tagsEnteredList];

    const keyCode = e.keyCode || e.which;

    if (!isExist && keyCode === 13 && !isEmpty(e.target.value)) {
      newTagsList.push(e.target.value);
      setValues({
        ...values,
        [e.target.name]: "",
        tagsEnteredList: newTagsList,
      });
    }
  };

  const handleOnClickRemoveTag = (index) => (e) => {
    let newTagsList = [...values.tagsEnteredList];
    newTagsList.splice(index, 1);
    setValues({
      ...values,
      tagEntered: "",
      tagsEnteredList: newTagsList,
    });
  };

  const renderTagsBlock = () => {
    return (
      <div className="row mx-0 flex-nowrap align-items-start">
        <div className="flex-shrink-0 add-project-new-enter-tag-column">
          <h4 className="font-18-bold color-offwhite mb-30">Enter Tags</h4>
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms container-login-flow-input--forms--add-new-project-small"
            //label="estimateCost"
            placeholder="Type &amp; Enter"
            name="tagEntered"
            value={values.tagEntered}
            onChange={handleChangeEnterTags}
            onKeyPress={handleOnKeyDownEnterTags}
            type="text"
          />
        </div>
        <div className="add-project-new-selected-tags-column">
          <h4 className="font-18-bold color-offwhite mb-30">
            <img
              src="/img/icons/add-project-new-tags-icon.svg"
              alt=""
              className="add-project-new-tags-icon"
            />
            Selected Tags
          </h4>
          <div className="row mx-0 align-items-center add-project-new-tags-block-row">
            {values.tagsEnteredList.map((data, index) => (
              <div key={index} className="add-project-new-tags-block">
                <i className="fa fa-circle"></i>

                <span className="font-14-semibold">{data}</span>

                <button
                  onClick={handleOnClickRemoveTag(index)}
                  className="add-project-new-tags-block__timesBtn"
                >
                  <i className="fa fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /*===============================================================================
      renderAddMoreDetails
  ===============================================================================*/

  const renderAddMoreDetails = () => {
    return (
      <>
        <div className="mt-50">{renderSelectMembers()}</div>
        <div className="row mx-0 align-items-center">
          <Select
            className="react-select-container react-select-container--addMember react-select-container--add-new-project react-select-container--addMember--selectMember"
            classNamePrefix="react-select-elements"
            value={values.client}
            onChange={handleChangeClient}
            options={clientOption}
            isSearchable={false}
            placeholder="Client Name"
          />

          <Link to="/add-new-client">
            <div className="add-project-new-add-client-button">Add Client</div>
          </Link>
        </div>
        <div className="mt-30">
          <div className="add-new-project-date-picker">
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

          <div className="row mx-0 align-items-start">
            <InputFieldNumber
              containerClassName="container-login-flow-input container-login-flow-input--forms container-login-flow-input--forms--add-new-project-small"
              //label="estimateCost"
              placeholder="Estimated cost to company ($)"
              name="estimateCost"
              value={values.estimateCost}
              onChange={handleChangeNumber}
              maxLength="7"
            />
            <div className="add-new-project-estimate-hour-div">
              <InputFieldNumber
                containerClassName="container-login-flow-input container-login-flow-input--forms container-login-flow-input--forms--add-new-project-small"
                //label="Project name"
                placeholder="Estimated hours"
                name="estimateHour"
                value={values.estimateHour}
                onChange={handleChangeNumber}
                maxLength="5"
              />
            </div>
          </div>
          <div className="custom-editor-quill custom-editor-quill--all-project">
            <EditorQuillCommon
              placeholder="Enter Description"
              editorState={values.editorQuillTextValue}
              handleOnChangeEditor={handleOnChangeEditor}
              // error={values.errors.editorQuillTextValue}
            />
          </div>
          {/*!isEmpty(values.projectCustomFields) ? (
            <h5 className="font-21-medium mt-5">Custom Fields</h5>
          ) : (
            ""
          )}
          {/*!isEmpty(values.projectCustomFields) &&
            values.projectCustomFields.map((data, index) => {
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
      </>
    );
  };

  /*===============================================================================
      main
  ===============================================================================*/
  return (
    <>
      {/* left navbar */}
      <LeftNavbar activeMenu="all projects" />
      <div className="main-page-padding">
        {/* pagetitle and topnavbar */}
        <div className="pageTitle-topNavbar-div">
          <PageTitle title="Add New Project" />
          <TopNavbar />
        </div>

        <BreadcrumbMenu
          menuObj={[
            {
              title: "Projects",
              link: "/all-projects",
            },
            {
              title: "Add New Project",
            },
          ]}
        />
        <div className="row mx-0 flex-nowrap mt-50">
          <div className="col-6 px-0">
            <h4 className="font-18-bold color-offwhite">Enter Project name</h4>
            <InputFieldEmailTextPassword
              containerClassName="mt-40 container-login-flow-input container-login-flow-input--forms container-login-flow-input--forms--add-new-project"
              label="Project name"
              placeholder="Project Name"
              name="projectName"
              value={values.projectName}
              onChange={handleChange}
              type="text"
              error={errors.projectName}
              maxLength={maxLengths.char50}
            />

            <button
              className="font-18-bold add-new-project-more-details mt-30"
              onClick={handleAddMoreDetail}
            >
              <img
                src={require("../../../assets/img/icons/add-more-details-icon.png")}
                alt=""
              />
              <u className="add-new-project-more-details__text1">
                Add more details
              </u>
              <span className="add-new-project-more-details__arrows">
                {isAddMoreDetail ? (
                  <i className="fa fa-chevron-up" />
                ) : (
                  <i className="fa fa-chevron-down" />
                )}
              </span>
            </button>

            <div>{isAddMoreDetail && <>{renderAddMoreDetails()}</>}</div>
          </div>
          <div className="col-6 px-0">
            {renderAddCoverImage()}

            <div className="pt-20">
              {isAddMoreDetail && <>{renderTagsBlock()}</>}
            </div>
          </div>
        </div>
        {isAddMoreDetail && (
          <div>
            {!isEmpty(values.projectCustomFields) ? (
              <h5 className="font-21-medium mt-5">Custom Fields</h5>
            ) : (
              ""
            )}
            <div className="row mx-0 align-items-start">
              {!isEmpty(values.projectCustomFields) &&
                values.projectCustomFields.map((data, index) => {
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
                })}
            </div>
          </div>
        )}
        <GreenButtonSmallFont
          text={"Save"}
          onClick={handleSave}
          extraClassName="mt-40"
        />
      </div>
    </>
  );
}

AddProjectNew.defaultProps = {
  isEdit: false,
};
