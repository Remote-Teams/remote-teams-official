import React, { useState, useEffect } from "react";
import LeftNavbar from "../header/LeftNavbar";
import TopNavbar from "../header/TopNavbar";
import PageTitle from "../common/PageTitle";
import BreadcrumbMenu from "../common/BreadcrumbMenu";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import UploadImage from "../common/UploadImage";
import Toggle from "../common/Toggle";
// import UploadFile from "../common/UploadFile";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import InputFieldPhoneCountryNumber from "../common/InputFieldPhoneCountryNumber";
import DatePickerFromToDate from "../common/DatePickerFromToDate";
import UploadMultipleFiles from "../common/UploadMultipleFiles";
import isEmpty from "../../../store/validations/is-empty";
import {
  addNewClient,
  inviteClient,
} from "./../../../store/actions/clientAction";
import Select from "react-select";
import { getAllUserRoles } from "./../../../store/actions/authAction";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { startOfMonth, endOfMonth } from "date-fns";
import { uploadFile } from "./../../../store/actions/allProjectDiscussionAction";
import { getAllCustomFieldsByEntity } from "./../../../store/actions/commandCenterAction";
import { validateAddClient } from "./../../../store/validations/clientValidation/ClientAddValidation";

export default function AddNewClient() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [addMoreDetails, setAddMoreDetails] = useState(false);

  const [values, setValues] = useState({
    clientName: "",
    isStatusActive: true,
    thumbnail: "",
    contactName: "",
    contactCountryCode: "+1",
    contactNumber: "",
    contactEmail: "",
    multipleContact: [],
    location: "",
    website: "",
    billingAddress1: "",
    shippingAddress1: "",
    billingAddress2: "",
    shippingAddress2: "",
    billingAddress3: "",
    shippingAddress3: "",
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
    fileName: [],
    fileData: [],
    shareInviteEmail: "",
    customTextboxfieldData: {},
    customeDropdownFieldData: {
      // Dropdown: { value: "Facebook", label: "Facebook" },
    },
    clientCustomFields: [],
  });

  const [errors, setErrors] = useState({});

  const [allRoles, setAllRoles] = useState([]);
  const [fileUrl, setFileUrl] = useState("");

  const allRolesReducer = useSelector((state) => state.auth.allRoles);

  useEffect(() => {
    dispatch(getAllUserRoles());
    dispatch(getAllCustomFieldsByEntity("CLIENT"));
  }, []);

  useEffect(() => {
    if (!isEmpty(allRolesReducer)) {
      setAllRoles(allRolesReducer);
    }
  }, [allRolesReducer]);

  const clientCustomFields = useSelector(
    (state) => state.commandCenter.clientCustomFields
  );

  useEffect(() => {
    if (!isEmpty(clientCustomFields)) {
      let textBoxData = clientCustomFields.filter(
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
        clientCustomFields: clientCustomFields,
        customTextboxfieldData: textDataFinalObject,
      });
    } else {
      setValues({
        ...values,
        clientCustomFields: [],
        customTextboxfieldData: {},
      });
    }
  }, [clientCustomFields]);

  /*===================================
         handler
===================================*/
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

  const handleOnChangeToggle = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.checked,
    });
  };

  const callBackFileUpload = (data) => {
    setFileUrl(data.fileUrl);
  };

  const handleOnChangeUploadImg = (e) => {
    e.preventDefault();
    const data = new FormData();
    // data.append("image", e.target.files[0].name);
    data.append("file", e.target.files[0]);
    setValues({
      ...values,
      thumbnail:
        e.target.files.length > 0
          ? URL.createObjectURL(e.target.files[0])
          : e.target.value,
    });

    dispatch(uploadFile(data, callBackFileUpload));
  };

  const handleChangeCountryCode = (val) => {
    console.log(val);
    setValues({
      ...values,
      contactCountryCode: val,
    });
  };

  const handleChangeNumber = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.validity.valid ? e.target.value : "",
    });
  };

  const handleChangeMultiContactName = (index) => (e) => {
    let multipleContact = values.multipleContact;
    multipleContact[index].contactName = e.target.value;
    setValues({ ...values, multipleContact });
  };

  const handleChangeCountryCodeMultiContact = (value, index) => {
    let multipleContact = values.multipleContact;
    multipleContact[index].contactCountryCode = value;
    setValues({ ...values, multipleContact });
  };

  const handleChangeNumberMultiContact = (index) => (e) => {
    let multipleContact = values.multipleContact;
    multipleContact[index].contactNumber = e.target.validity.valid
      ? e.target.value
      : "";
    setValues({ ...values, multipleContact });
  };

  const handleChangeMultiContactEmail = (index) => (e) => {
    let multipleContact = values.multipleContact;
    multipleContact[index].contactEmail = e.target.value;
    setValues({ ...values, multipleContact });
  };

  const handleOnClickAddMoreContact = () => {
    let obj = {
      contactName: "",
      contactCountryCode: "+1",
      contactNumber: "",
      contactEmail: "",
    };
    let multipleContact = values.multipleContact;
    multipleContact.push(obj);
    setValues({ ...values, multipleContact });
  };

  const handleOnClickRemoveContact = (index) => (e) => {
    let multipleContact = values.multipleContact;
    multipleContact.splice(index, 1);
    setValues({ ...values, multipleContact });
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

  const callBackAddClient = (status) => {
    if (status === 200 && values.isStatusActive === true) {
      const formData = {
        recipients: [
          {
            email: values.contactEmail,
            firstName: values.clientName,
            lastName: "",
            profileImage: "",
            additionalInfo: {},
            memberType: "CLIENT",
            phone: "",
            location: "",
            timezone: "",
            contract: {
              start_date: "",
              end_date: "",
              working_hrs_to: "",
              working_hrs_from: "",
              ctc: "",
              attachments: values.fileData,
            },
            demo: false,
            role: allRoles[3]._id,
            dateOfJoining: new Date().toISOString(),
            jobTitle: "Client",
          },
        ],
      };
      dispatch(inviteClient(formData));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    // console.log(values);
    const {
      clientCustomFields,
      customTextboxfieldData,
      customeDropdownFieldData,
    } = values;

    const { errors, isValid } = validateAddClient(values);

    if (!isValid) {
      console.log(errors);
      setErrors(errors);
    } else {
      let secondaryContactPerson =
        !isEmpty(values.multipleContact) &&
        values.multipleContact.map((contact) => ({
          name: contact.contactName,
          country_code: contact.contactCountryCode,
          phone: contact.contactNumber,
          email: contact.contactEmail,
        }));

      const formData = {
        name: values.clientName,
        status: "ACTIVE",
        defaultEmail: values.shareInviteEmail,
        primaryContactPerson: {
          name: values.clientName,
          country_code: values.contactCountryCode,
          phone: values.contactNumber,
          email: values.contactEmail,
        },
        secondaryContactPerson: secondaryContactPerson,
        location: values.location,
        website: values.website,
        addresses: {
          billing_line_one: values.billingAddress1,
          billing_line_two: values.billingAddress2,
          billing_line_three: values.billingAddress3,
          shipping_line_one: values.shippingAddress1,
          shipping_line_two: values.shippingAddress2,
          shipping_line_three: values.shippingAddress3,
        },
        contract: {
          start_date: values.startDate.toISOString(),
          end_date: values.endDate.toISOString(),
        },
        documents: values.fileData,
        coverImg: fileUrl,
      };

      dispatch(
        addNewClient(
          formData,
          clientCustomFields,
          customTextboxfieldData,
          customeDropdownFieldData,
          history,
          callBackAddClient
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
    );
  };

  /*==================================================
            CUSTOM FIELD SECTION END
  ====================================================*/

  /*=====================================
                  renderRowOne
    ======================================*/
  const renderRowOne = () => {
    return (
      <div>
        <div className="row mx-0 align-items-start mt-50">
          <div className="col-5 pl-0">
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--add-new-clients"
              //label="Client name"
              placeholder="Client name"
              name="clientName"
              value={values.clientName}
              onChange={handleChange}
              type="text"
              error={!isEmpty(errors.clientName) && errors.clientName}
            />
            <div className="mt-50">
              <h3 className="font-24-bold color-offwhite mb-50">
                Allow Access to Project ?
              </h3>
              <Toggle
                containerClassName="client-toggle-div"
                textClassName="client-card-subtittle-text client-card-subtittle-text--toggle"
                name="isStatusActive"
                text1={"Yes"}
                text2={"No"}
                onChange={handleOnChangeToggle}
                defaultChecked={values.isStatusActive}
              />
            </div>
            {values.isStatusActive && renderInviteEmail()}
            <div className="mt-20">
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
            </div>
          </div>
          <div className="col-5 pl-0">
            <UploadImage
              containerClassName="upload-img__mainBlock upload-img__mainBlock--add-new-client upload-img__mainBlock--new-client-img"
              //buttonName="+ Cover Image"
              buttonName="Upload Image"
              fileNameValue={values.thumbnail}
              acceptType="image/jpeg, image/png"
              onChange={handleOnChangeUploadImg}
            />
          </div>
        </div>
      </div>
    );
  };
  /*=====================================================
             Invite Client for loign
  ======================================================*/
  const renderInviteEmail = () => {
    return (
      <div className="row mx-0 flex-nowrap">
        <div className="mt-50">
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--add-new-clients"
            //label="Share invite with email address"
            placeholder="Share invite with email address"
            name="shareInviteEmail"
            value={values.shareInviteEmail}
            onChange={handleChange}
            type="email"
            error={!isEmpty(errors.shareInviteEmail) && errors.shareInviteEmail}
          />
        </div>
      </div>
    );
  };

  /*=======================================
                renderRowTwo
  ========================================*/
  const renderRowTwo = () => {
    return (
      <div className="row mx-0 flex-nowrap">
        <div className="mr-60">
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms"
            //label="Primary contact name"
            placeholder="Primary contact name"
            name="contactName"
            value={values.contactName}
            onChange={handleChange}
            type="text"
            //error={!isEmpty(errors.contactName) && errors.contactName}
          />
        </div>
        <div className="mr-60">
          <InputFieldPhoneCountryNumber
            containerClassName="container-login-flow-input container-login-flow-input--add-new-client-pnumber container-login-flow-input--forms"
            //label="primary contact number"
            placeholder="primary contact phone number"
            name="contactNumber"
            value={values.contactNumber}
            countryCode={values.contactCountryCode}
            handleChangeCountryCode={handleChangeCountryCode}
            onChange={handleChangeNumber}
            //errorCountryCode={""}
            //errorPhone={!isEmpty(errors.contactNumber) && errors.contactNumber}
          />
        </div>
        <div className="mr-60">
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms"
            //label="primary contact email"
            placeholder="primary contact mail address"
            name="contactEmail"
            value={values.contactEmail}
            onChange={handleChange}
            type="email"
            //error={!isEmpty(errors.contactEmail) && errors.contactEmail}
          />
        </div>
        <div>
          <div></div>
          <button
            className="new-gradient-btn"
            onClick={handleOnClickAddMoreContact}
          >
            + Point Of Contact
          </button>
        </div>
      </div>
    );
  };
  /*=================================================================
      renderRow2MultipleContact
  =================================================================*/
  const renderRow2MultipleContact = () => {
    return (
      <>
        {values.multipleContact.map((data, index) => (
          <div key={index} className="row mx-0 mt-50 flex-nowrap">
            <div className="mr-60">
              <InputFieldEmailTextPassword
                containerClassName="container-login-flow-input container-login-flow-input--forms"
                //label="contact name"
                placeholder="contact name"
                name="contactName"
                value={data.contactName}
                onChange={handleChangeMultiContactName(index)}
                type="text"
              />
            </div>
            <div className="mr-60">
              <InputFieldPhoneCountryNumber
                index={index}
                containerClassName="container-login-flow-input container-login-flow-input--forms container-login-flow-input--add-new-client-pnumber"
                //label="contact number"
                placeholder="contact phone number"
                name="contactNumber"
                value={data.contactNumber}
                countryCode={data.contactCountryCode}
                handleChangeCountryCode={handleChangeCountryCodeMultiContact}
                onChange={handleChangeNumberMultiContact(index)}
                errorCountryCode={""}
                errorPhone={""}
              />
            </div>
            <div className="mr-60">
              <InputFieldEmailTextPassword
                containerClassName="container-login-flow-input container-login-flow-input--forms"
                //label="contact email"
                placeholder="contact mail address"
                name="contactEmail"
                value={data.contactEmail}
                onChange={handleChangeMultiContactEmail(index)}
                type="email"
              />
            </div>
            <div>
              <i
                className="fa fa-times mult-contact-delete-icon mult-contact-delete-icon--add-new-client"
                onClick={handleOnClickRemoveContact(index)}
              ></i>
            </div>
          </div>
        ))}
      </>
    );
  };

  /*=================================================================
                     renderRowThree
  =================================================================*/
  const renderRowThree = () => {
    return (
      <div className="row mx-0 mt-50">
        <div className="col-4 pl-0">
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms"
            //label="Location"
            placeholder="Location"
            name="location"
            value={values.location}
            onChange={handleChange}
            type="text"
          />
        </div>
      </div>
    );
  };

  /*=================================================================
                        renderRow4
  =================================================================*/
  const renderRow4 = () => {
    return (
      <div className="row mx-0 mt-50">
        <div className="col-4 pl-0">
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms"
            //label="Website"
            placeholder="Website"
            name="website"
            value={values.website}
            onChange={handleChange}
            type="text"
          />
        </div>
      </div>
    );
  };

  /*===================================================
                renderBillingAddress
  =====================================================*/
  const renderBillingAddress = () => {
    return (
      <div className="row mx-0 mt-40">
        <div className="mr-60">
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms"
            //label="Website"
            placeholder="Billing Address L1"
            name="billingAddress1"
            value={values.billingAddress1}
            onChange={handleChange}
            type="text"
          />
        </div>
        <div className="mr-60">
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms"
            //label="Website"
            placeholder="Billing Address L2"
            name="billingAddress2"
            value={values.billingAddress2}
            onChange={handleChange}
            type="text"
          />
        </div>
        <div>
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms"
            //label="Website"
            placeholder="Billing Address L3"
            name="billingAddress3"
            value={values.billingAddress3}
            onChange={handleChange}
            type="text"
          />
        </div>
      </div>
    );
  };

  /*===================================================
                renderShippingAddress
  =====================================================*/
  const renderShippingAddress = () => {
    return (
      <div className="row mx-0 align-items-start mt-40">
        <div className="mr-60">
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms"
            placeholder="Shipping Address L1"
            name="shippingAddress1"
            value={values.shippingAddress1}
            onChange={handleChange}
            type="text"
          />
        </div>
        <div className="mr-60">
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms"
            placeholder="Shipping Address L2"
            name="shippingAddress2"
            value={values.shippingAddress2}
            onChange={handleChange}
            type="text"
          />
        </div>
        <div>
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms"
            placeholder="Shipping Address L3"
            name="shippingAddress3"
            value={values.shippingAddress3}
            onChange={handleChange}
            type="text"
          />
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
      <div className="mt-50">
        <UploadMultipleFiles
          containerClassName="upload-img__mainBlock upload-img__mainBlock--new-client"
          buttonName="Choose files"
          //buttonName="+ New Doc"
          fileNameValue={values.fileName}
          // acceptType="image/jpeg, image/png"
          onChange={handleOnChangeUploadDocuments}
          handleOnClickRemoveDocument={handleOnClickRemoveDocument}
        />
      </div>
    );
  };

  /*===================================================
                renderDateAndAttachment
  =====================================================*/
  const renderDateAndAttachment = () => {
    return (
      <div className="row mx-0 align-items-start add-new-client-date-and-attachment-div">
        <div className="col-6 pl-0">
          <h3 className="font-18-bold color-offwhite">Contract Period</h3>
          <div className="add-new-client-datepicker mt-50">
            <DatePickerFromToDate
              //labelStart="Start date"
              startDateValue={values.startDate}
              //labelEnd="End date"
              endDateValue={values.endDate}
              handleChangeStart={handleChangeStart}
              handleChangeEnd={handleChangeEnd}
              placeholderStart="Start date"
              placeholderEnd="End date"
              //error={errors}
            />
          </div>
        </div>
        <div className="col-6">
          <h3 className="font-18-bold color-offwhite">Attach Document </h3>
          {renderUploadMultipleFiles()}
        </div>
      </div>
    );
  };
  /*=======================================
                renderAddMoreDetails
  ========================================*/
  const renderAddMoreDetails = () => {
    return (
      <div className="add-more-details-content-div">
        {renderRowTwo()}
        {renderRow2MultipleContact()}
        {renderRowThree()}
        <h3 className="font-18-bold add-new-client-work-details-text">
          Work Details
        </h3>
        {renderRow4()}
        <h3 className="font-18-bold color-offwhite mt-50">Billing Address</h3>
        {renderBillingAddress()}
        <h3 className="font-18-bold color-offwhite mt-50">Shipping Address</h3>
        {renderShippingAddress()}
        {renderDateAndAttachment()}
        {!isEmpty(values.clientCustomFields) ? (
          <h5 className="font-18-bold color-offwhite mt-5">Custom Fields</h5>
        ) : (
          ""
        )}
        <div className="row mx-0 align-items-start">
          {!isEmpty(values.clientCustomFields) &&
            values.clientCustomFields.map((data, index) => {
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
    );
  };
  /*=======================================
                return
  ========================================*/

  return (
    <div>
      {/* left navbar */}
      <LeftNavbar activeMenu="clients" />
      <div className="main-page-padding">
        {/* pagetitle and topnavbar */}
        <div className="pageTitle-topNavbar-div">
          <PageTitle title="clients" />
          <TopNavbar />
        </div>

        <BreadcrumbMenu
          menuObj={[
            {
              title: "Clients",
              link: "/clients",
            },
            {
              title: "Add New Client",
            },
          ]}
        />
        <div className="add-new-client-div">
          <h1 className="add-new-client-title">Add New Client</h1>
          {renderRowOne()}
          {addMoreDetails ? renderAddMoreDetails() : ""}

          <GreenButtonSmallFont
            text={"Save"}
            onClick={handleSave}
            extraClassName={"add-new-client-save-btn"}
          />
        </div>
      </div>
    </div>
  );
}
