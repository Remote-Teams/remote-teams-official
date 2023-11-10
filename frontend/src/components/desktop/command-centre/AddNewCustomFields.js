import React, { Fragment, useState } from "react";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import Modal from "react-responsive-modal";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import Toggle from "../common/Toggle";
import isEmpty from "../../../store/validations/is-empty";
import { customFieldIsExist } from "./../../../store/actions/commandCenterAction";
import { useDispatch } from "react-redux";
import { validateAddAccountCustomField } from "./../../../store/validations/commandCenterValidation/AddCustomFieldValidation";

export default function AddNewCustomFields({ entity }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({
    fieldName: "",
    fieldType: true,
    multipleOption: [
      {
        value: "Choice 1",
        label: "Choice 1",
      },
      {
        value: "Choice 2",
        label: "Choice 2",
      },
    ],
  });
  const [frontEndErrors, setFrontEndErrors] = useState({});

  // const [multipleOption, setmultipleOption] = useState([
  //   {
  //     value: "Choice 1",
  //     label: "Choice 1",
  //   },
  //   {
  //     value: "Choice 2",
  //     label: "Choice 2",
  //   },
  //   {
  //     value: "Choice 3",
  //     label: "Choice 3",
  //   },
  //   {
  //     value: "Choice 4",
  //     label: "Choice 4",
  //   },
  // ]);

  /*==========================================
              handler
 ===========================================*/

  const handleChange = (e) => {
    setFrontEndErrors({});
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnChangeToggle = (e) => {
    setValues({
      ...values,
      multipleOption: [
        {
          value: "Choice 1",
          label: "Choice 1",
        },
        {
          value: "Choice 2",
          label: "Choice 2",
        },
      ],
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
    setValues({
      ...values,
      multipleOptions,
    });

    console.log(multipleOptions);
  };

  const callBackCustomFields = (status) => {
    if (status === 200) {
      setOpen(false);
      setValues({
        fieldName: "",
        fieldType: true,
        multipleOptions: [
          {
            value: "Choice 1",
            label: "Choice 1",
          },
          {
            value: "Choice 2",
            label: "Choice 2",
          },
        ],
      });
      // setmultipleOption([]);
    }
  };

  const handleSave = () => {
    console.log(values);

    const { errors, isValid } = validateAddAccountCustomField(values, entity);
    if (!isValid) {
      // console.log(errors);
      setFrontEndErrors(errors);
    } else {
      if (values.fieldType === true) {
        const formData = {
          name: values.fieldName,
          entity: entity,
          type: "TEXTBOX",
          category: "STRING",
          // options: ["abc", "bcd", "dsdef"],
        };
        // console.log(formData);
        // this.props.createCustomField(formData, this.callBackCustomFields);
        dispatch(
          customFieldIsExist(
            values.fieldName,
            entity,
            formData,
            callBackCustomFields
          )
        );
      } else {
        // const { multipleOptions } = values;
        let dropDownOptions = [];
        if (!isEmpty(values.multipleOption)) {
          values.multipleOption.forEach((element) => {
            dropDownOptions.push(element.value);
          });
        }

        console.log(dropDownOptions);

        const formData = {
          name: values.fieldName,
          entity: entity,
          type: "DROPDOWN",
          category: "STRING",
          options: dropDownOptions,
        };
        // console.log(formData);
        // this.props.createCustomField(formData, this.callBackCustomFields);
        dispatch(
          customFieldIsExist(
            values.fieldName,
            entity,
            formData,
            callBackCustomFields
          )
        );
      }
    }
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
              {!isEmpty(values.multipleOption) &&
                values.multipleOption.map((data, index) => (
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
      <GreenButtonSmallFont
        text={"Add New Field"}
        extraClassName="add-custom-fields-btn"
        onClick={handleOpenModal}
      />
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
          <h2 className="add-new-custom-fields-title">Add New Field</h2>
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
                error={!isEmpty(frontEndErrors) && frontEndErrors.fieldName}
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
                defaultChecked={values.fieldType === true}
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
