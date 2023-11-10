import React, { useState, useEffect } from "react";
import Select from "react-select";
import TaskMemberDisplayList from "../common/TaskMemberDisplayList";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import InputFieldNumber from "../common/InputFieldNumber";
import DatePickerFromToDate from "../common/DatePickerFromToDate";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import { startOfMonth, endOfMonth } from "date-fns";
import Modal from "react-responsive-modal";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import isEmpty from "../../../store/validations/is-empty";
import { coverImageOptions } from "./coverImageOptions";
import { useDispatch, useSelector } from "react-redux";
import { getAllClients } from "./../../../store/actions/clientAction";
import {
  getAllResourceAction,
  resourceSearchApi,
} from "./../../../store/actions/resourcesAction";
import { updateProject } from "./../../../store/actions/projectAction";
import { getAllFieldsValue } from "./../../../store/actions/commandCenterAction";

import EditorQuillCommon from "../common/EditorQuillCommon";
// const imgPath = "/img/add-project-cover-img-options";

export default function EditProject({ projectData }) {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
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
    customFields: "",
    customFieldsSelected: "",
    projectCustomFields: [],
    customTextboxfieldData: {},
    customeDropdownFieldData: {},
    editorQuillTextValue: "",
  });

  useEffect(() => {
    dispatch(getAllClients());
    dispatch(
      resourceSearchApi({
        query: {},
      })
    );
    // dispatch(getAllResourceAction());
  }, []);

  useEffect(() => {
    dispatch(
      getAllFieldsValue({
        entity_Id: projectData._id,
      })
    );
  }, [open === true]);

  useEffect(() => {
    if (!isEmpty(projectData)) {
      setValues({
        ...values,
        projectName: projectData.name,
        tagsEnteredList: projectData.tags,
        startDate: new Date(projectData.startDate),
        endDate: new Date(projectData.endDate),
        estimateCost: projectData.estimatedCTC,
        estimateHour: projectData.estimatedHours,
        selectedCoverImage: !isEmpty(projectData.logo)
          ? projectData.logo
          : coverImageOptions[11].img,
        editorQuillTextValue: projectData.description,
      });

      // dispatch(getAllCustomFieldsByEntity("PROJECT"));
    }
  }, [open === true]);

  const [editorQuillTextValue, setEditorQuillTextValue] = useState("");

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
      if (!isEmpty(newArray) && !isEmpty(projectData.client)) {
        let selectedClient = newArray.filter(
          (ele) => ele.value === projectData.client._id
        );
        setValues({
          ...values,
          client: selectedClient,
          projectName: projectData.name,
          tagsEnteredList: projectData.tags,
          startDate: new Date(projectData.startDate),
          endDate: new Date(projectData.endDate),
          estimateCost: projectData.estimatedCTC,
          estimateHour: projectData.estimatedHours,
          selectedCoverImage: !isEmpty(projectData.logo)
            ? projectData.logo
            : coverImageOptions[11].img,
        });
      }
    }
  }, [allClients, projectData]);

  useEffect(() => {
    if (!isEmpty(allResources)) {
      let newArray =
        !isEmpty(allResources) &&
        allResources.map((client) => ({
          value: client._id,
          label: client.name,
        }));

      setoptions(newArray);
      if (!isEmpty(newArray) && !isEmpty(projectData.resources)) {
        let defaultMemeber = !isEmpty(projectData.resources)
          ? projectData.resources.map((user) => ({
              value: user._id,
              label: user.firstName,
            }))
          : [];
        setValues({
          ...values,
          // selectOption: selectedMember,
          displayListSelected: defaultMemeber,
          projectName: projectData.name,
          tagsEnteredList: projectData.tags,
          startDate: new Date(projectData.startDate),
          endDate: new Date(projectData.endDate),
          estimateCost: projectData.estimatedCTC,
          estimateHour: projectData.estimatedHours,
          selectedCoverImage: !isEmpty(projectData.logo)
            ? projectData.logo
            : coverImageOptions[11].img,
        });
      }
    }
  }, [allResources, projectData]);

  const allFieldsValue = useSelector(
    (state) => state.commandCenter.allFieldsValue
  );

  useEffect(() => {
    if (!isEmpty(allFieldsValue)) {
      let textDataFinalObject = {};
      let dropdownDataFinalObject = {};
      allFieldsValue.forEach((ele) => {
        // console.log(ele);
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
        projectCustomFields: allFieldsValue,
        customTextboxfieldData: textDataFinalObject,
        customeDropdownFieldData: dropdownDataFinalObject,
      });
    } else {
      setValues({
        ...values,
        projectCustomFields: [],
        customTextboxfieldData: {},
        customeDropdownFieldData: {},
      });
    }
  }, [allFieldsValue]);

  /*===========================================================
                      buttonText
  ============================================================*/

  const editText = (
    <>
      <img
        src={require("../../../assets/img/icons/all-project-card-edit-icon.svg")}
        alt="edit"
        //className="project-green-pin-img"
      />
      <span>Edit</span>
    </>
  );

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

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };
  const handleChangeClient = (selectedOption) => {
    setValues({
      ...values,
      client: selectedOption,
    });
  };

  const handleChangeNumber = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.validity.valid ? e.target.value : "",
      errors: {},
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

  const callBackUpdateProject = (status) => {
    if (status === 200) {
      handleClose();
    }
  };

  const handleCustomeDropdownChange = (selectedOption) => {
    setValues({ ...values, customFieldsSelected: selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log(values);
    const {
      customTextboxfieldData,
      customeDropdownFieldData,
      projectCustomFields,
    } = values;

    let newArray = [];

    if (!isEmpty(values.displayListSelected)) {
      let data = values.displayListSelected.map((member) => member.value);
      newArray = data;
    }

    const formData = projectData;
    formData.name = values.projectName;
    formData.client = values.client.value;
    formData.logo = values.selectedCoverImage;
    formData.startDate = values.startDate.toISOString();
    formData.endDate = values.endDate.toISOString();
    formData.estimatedCTC = parseInt(values.estimateCost);
    formData.estimatedHours = parseInt(values.estimateHour);
    formData.description = values.editorQuillTextValue;
    formData.tags = values.tagsEnteredList;
    formData.resources = newArray;

    dispatch(
      updateProject(
        formData._id,
        formData,
        customTextboxfieldData,
        customeDropdownFieldData,
        projectCustomFields,
        callBackUpdateProject,
        "Project Updated"
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
      <div className="add-project-add-cover-image-main-block add-project-add-cover-image-main-block--edit">
        <div className="edit-project-cover-img-div">
          {/* {!isEmpty(projectData.logo) ? ( */}
          <img src={values.selectedCoverImage} alt="" />
          {/* ) : (
            <img src={`${imgPath}/ci-12.png`} alt="" />
          )} */}

          <button
            className="edit-project-cover-img-add-btn"
            onClick={handleOnClickAddCoverImage}
          >
            <i className="fa fa-pencil" />
          </button>
        </div>
        {displayCoverImageOptionBlock && (
          <div className="add-project-new-default-cover-img-options-block add-project-new-default-cover-img-options-block--edit">
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
                        selectedMember
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
        <h5 className="font-18-bold color-offwhite">Selected Members</h5>
        <Select
          className="react-select-container mt-20 mb-40 react-select-container--addMember react-select-container--edit-new-project react-select-container--addMember--selectMember"
          classNamePrefix="react-select-elements"
          value={values.selectOption}
          onChange={handleChangeSelectClient}
          options={options}
          isSearchable={false}
          placeholder="Select Members"
        />

        <h4 className="font-18-bold color-offwhite mb-20">Selected members</h4>
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
      <div>
        <div className="flex-shrink-0 add-project-new-enter-tag-column">
          <h4 className="font-18-bold color-offwhite mb-20">Entered Tags</h4>
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--edit-project-tag-input"
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
          {/*          <h4 className="font-18-bold color-offwhite mb-30">
            <img
              src="/img/icons/add-project-new-tags-icon.svg"
              alt=""
              className="add-project-new-tags-icon"
            />
            Selected Tags
          </h4>
    */}
          <h4 className="font-18-bold color-offwhite mb-20">Selected Tags</h4>
          <div className="row mx-0 align-items-center add-project-new-tags-block-row">
            {!isEmpty(values.tagsEnteredList) &&
              values.tagsEnteredList.map((data, index) => (
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

  /*==============================================================
                       renderDate
==============================================================*/
  const renderDate = () => {
    return (
      <div>
        <div className="row mx-0 mt-40">
          <h3 className="font-18-bold color-offwhite edit-project-start-date-label">
            Start Date
          </h3>
          <div className="col-5 ">
            <h3 className="font-18-bold color-offwhite">End Date</h3>
          </div>
        </div>

        <div className="add-new-project-date-picker add-new-project-date-picker--edit mt-20">
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
    );
  };

  /*==============================================================
                       renderCostAndHours
==============================================================*/
  const renderCostAndHours = () => {
    return (
      <div className="row mx-0 mt-40 align-items-start">
        <div className="edit-project-estimate-cost-div">
          <h3 className="font-18-bold color-offwhite">Cost of Company</h3>
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--edit-cost mt-20"
            //label="estimateCost"
            placeholder="Estimate cost of company($)"
            name="estimateCost"
            value={values.estimateCost}
            onChange={handleChange}
            type="text"
          />
        </div>
        <div>
          <h3 className="font-18-bold color-offwhite">Estimated hour</h3>
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--edit-cost mt-20"
            //label="estimateCost"
            placeholder="Estimated hour"
            name="estimateHour"
            value={values.estimateHour}
            onChange={handleChange}
            type="text"
          />
        </div>
      </div>
    );
  };
  /*==============================================================
                       renderTitle
==============================================================*/
  const renderTitle = () => {
    return (
      <div className="row mx-0 align-items-start">
        <div>{renderAddCoverImage()}</div>
        <div className="col-6 pl-0">
          <h5 className="font-18-bold color-offwhite">Project Name</h5>
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--edit-project-name mt-20"
            //label="estimateCost"
            placeholder="Project Name"
            name="projectName"
            value={values.projectName}
            onChange={handleChange}
            type="text"
          />
        </div>
      </div>
    );
  };

  /*==============================================================
                       renderBasic
==============================================================*/
  const renderBasicTab = () => {
    return (
      <div>
        <h5 className="font-18-bold color-offwhite">Client Name</h5>
        <Select
          className="react-select-container react-select-container--addMember react-select-container--add-new-project react-select-container--addMember--selectMember mt-20 mb-40"
          classNamePrefix="react-select-elements"
          value={values.client}
          onChange={handleChangeClient}
          options={clientOption}
          isSearchable={false}
          placeholder="Client Name"
        />
        <div className="row mx-0 align-items-start">
          <div className="col-6 pl-0">{renderSelectMembers()}</div>
          <div className="col-5 pl-0">{renderTagsBlock()}</div>
        </div>
        {renderDate()}
        {renderCostAndHours()}
        <div className="custom-editor-quill">
          <EditorQuillCommon
            placeholder="Enter Description"
            editorState={values.editorQuillTextValue}
            handleOnChangeEditor={handleOnChangeEditor}
            // error={values.errors.editorQuillTextValue}
          />
        </div>
      </div>
    );
  };
  /*============================================================
                         Custom Fields
  ============================================================*/
  const renderCustomFieldsContent = () => {
    if (!isEmpty(values.projectCustomFields)) {
      return values.projectCustomFields.map((data, index) => {
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
    // return (
    //   <>
    //     <div className="row mx-0 align-items-start ">
    //       <div className="col-5 pl-0">
    //         <h3 className="font-18-bold color-offwhite">Custom Fields</h3>
    //         <InputFieldEmailTextPassword
    //           containerClassName="container-login-flow-input container-login-flow-input--forms mt-20"
    //           //label="shipping address line 3"
    //           name="customFields"
    //           value={values.customFields}
    //           onChange={handleChange}
    //           type="text"
    //           placeholder={"Custom Fields"}
    //         />
    //       </div>
    //       <div className="col-5">
    //         <h3 className="font-18-bold color-offwhite">Custom Fields 2</h3>
    //         <Select
    //           isSearchable={false}
    //           className="react-select-container react-select-container--addMember mt-20"
    //           classNamePrefix="react-select-elements"
    //           value={values.customFieldsSelected}
    //           onChange={handleCustomeDropdownChange}
    //           options={customOptions}
    //           placeholder="Select"
    //         />
    //       </div>
    //     </div>
    //   </>
    // );
  };
  /*==============================================================
                       render
==============================================================*/
  return (
    <div>
      <GrayButtonSmallFont
        text={editText}
        extraClassName="all-projects-cards-new-edit-button"
        onClick={handleOpen}
      />
      <Modal
        open={open}
        onClose={handleClose}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--edit-project",
          closeButton: "customCloseButton",
        }}
      >
        {/* close modal */}
        <span className="closeIconInModal" onClick={handleClose} />
        <div className="edit-project-div">
          {renderTitle()}

          <div className="profile_tabs_section pt-40 mt-0 profile_tabs_section--member-details-new">
            <Tabs>
              <TabList>
                <Tab>Basic</Tab>
                {!isEmpty(values.projectCustomFields) && (
                  <Tab>Custom Fields</Tab>
                )}
              </TabList>
              <TabPanel>
                <div className="edit-project-basic-overflow-div">
                  {renderBasicTab()}
                </div>
              </TabPanel>
              {!isEmpty(values.projectCustomFields) && (
                <TabPanel>
                  <div className="edit-project-basic-overflow-div">
                    {renderCustomFieldsContent()}
                  </div>
                </TabPanel>
              )}
            </Tabs>
          </div>
          <div className="text-right mt-50">
            <GreenButtonSmallFont
              text={"Save Changes"}
              extraClassName={"edit-project-save-btn"}
              onClick={handleSave}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
