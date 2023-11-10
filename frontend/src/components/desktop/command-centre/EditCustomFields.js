import React, { Fragment, useState, useEffect } from "react";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import Modal from "react-responsive-modal";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import Toggle from "../common/Toggle";
import isEmpty from "../../../store/validations/is-empty";
import { useDispatch } from "react-redux";
import { UpdateCustomFields } from "./../../../store/actions/commandCenterAction";

export default function EditCustomFields({ customFieldData }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({
    fieldName: "",
    fieldType: true,
    multipleOption: [],
  });

  useEffect(() => {
    if (!isEmpty(customFieldData)) {
      let optionArray = [];
      if (customFieldData.type === "DROPDOWN") {
        customFieldData.options.forEach((element) => {
          optionArray.push({ value: element, label: element });
        });
      }
      setValues({
        ...values,
        fieldName: customFieldData.name,
        multipleOption: optionArray,
        fieldType: customFieldData.type === "TEXTBOX" ? true : false,
        // defaultChecked:
        //   customFieldData.type === "TEXTBOX" ? true : false,
      });
    }
  }, [customFieldData]);

  /*==========================================
              handler
 ===========================================*/

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnChangeToggle = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.checked,
    });
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleOnChangeOptions = (index) => (e) => {
    let multipleOptions = values.multipleOption;

    multipleOptions[index].label = e.target.value;
    multipleOptions[index].value = e.target.value;

    setValues({
      ...values,
      multipleOptions,
    });

    console.log(values);
  };

  const handleOnClickAddMoreMultipleOption = () => {
    let multipleOptions = values.multipleOption;
    //let multipleOptionsLength = multipleOptions.length;

    let newOption = {
      value: "",
      label: "",
    };

    multipleOptions.push(newOption);
    setValues({ ...values, multipleOptions });

    console.log(multipleOptions);
  };

  const callBackUpdateField = (status) => {
    if (status === 200) {
      setOpen(false);
    }
  };

  const handleSave = () => {
    console.log(values);

    // const { customFieldData, multipleOptions } = this.state;
    let finalOptions = [];
    if (!isEmpty(values.multipleOption)) {
      values.multipleOption.forEach((ele) => {
        finalOptions.push(ele.value);
      });
    }

    let formData = customFieldData;
    formData.name = values.fieldName;
    formData.type = values.fieldType === true ? "TEXTBOX" : "DROPDOWN";
    formData.options = values.fieldType === true ? [] : finalOptions;

    dispatch(UpdateCustomFields(formData, callBackUpdateField));
  };
  /*========================================
             renderMultipleOption
  ======================================*/

  const renderMultipleOption = () => {
    return (
      <div>
        {!values.fieldType ? (
          <>
            <div className="row mx-0 align-items-baseline add-new-fields-multipleOption-div">
              {values.multipleOption.map((data, index) => (
                <Fragment key={index}>
                  <InputFieldEmailTextPassword
                    id={`optionName${index}`}
                    containerClassName="container-login-flow-input container-login-flow-input--forms "
                    name="label"
                    value={data.label}
                    onChange={handleOnChangeOptions(index)}
                    type="text"
                  />
                </Fragment>
              ))}
            </div>
            <button
              onClick={handleOnClickAddMoreMultipleOption}
              className="add-more-choice-btn"
            >
              +Add more choices
            </button>
          </>
        ) : (
          ""
        )}
      </div>
    );
  };

  /*==========================================
               return
  ============================================*/

  return (
    <>
      <button
        className="command-center-custom-fields-cards-edit-btn"
        onClick={handleOpenModal}
      >
        <i className="fa fa-pencil" />
        Edit
      </button>
      <Modal
        open={open}
        onClose={handleCloseModal}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--cmd-custom-fields",
          closeButton: "customCloseButton",
        }}
      >
        {/* close modal */}
        <span className="closeIconInModal" onClick={handleCloseModal} />
        {/* content */}
        <div className="add-new-custom-fields-div">
          <h2 className="add-new-custom-fields-title">Edit Custom Field</h2>
          <div className="add-new-custom-fields-outer-form-div">
            <h4 className="add-new-custom-fields-text1">Accounts</h4>
            <div className="add-new-custom-fields-filed-name-text">
              <h5 className="font-14-bold add-new-custom-fields-text2">
                Field Name
              </h5>
              <InputFieldEmailTextPassword
                containerClassName="container-login-flow-input container-login-flow-input--forms"
                name="fieldName"
                value={values.fieldName}
                onChange={handleChange}
                type="text"
              />
            </div>
            <div>
              <h5 className="font-14-bold add-new-custom-fields-text2">
                Field Type
              </h5>
              <Toggle
                //textClassName="client-card-subtittle-text"
                containerClassName="timesheet-toggle-all-project-history"
                name="fieldType"
                text1={"Text Field"}
                text2={"Multiple option"}
                onChange={handleOnChangeToggle}
                defaultChecked={values.fieldType}
              />
              {renderMultipleOption()}
            </div>
          </div>
        </div>
        <div className="text-center">
          <GreenButtonSmallFont
            onClick={handleSave}
            text={"Save"}
            extraClassName={"add-custom-fields-save-btn"}
          />
        </div>
      </Modal>
    </>
  );
}
