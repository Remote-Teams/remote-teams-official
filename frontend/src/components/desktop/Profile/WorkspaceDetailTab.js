import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateCustomerAddress } from "./../../../store/actions/paymentAction";
import { updateOrganizationAddress } from "./../../../store/actions/authAction";
import isEmpty from "../../../store/validations/is-empty";
import UploadImage from "../common/UploadImage";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import InputFieldNumber from "../common/InputFieldNumber";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function WorkspaceDetailTab() {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    oragnizationUploadedLogo: "",
    fileName: "",
    companyAddress: "",
    state: "",
    city: "",
    pincode: "",
    country: "",
    workspaceName: "",
  });

  useEffect(() => {
    let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));
    let customerStripeObject = JSON.parse(
      localStorage.getItem("customerStripeObject")
    );
    setValues({
      ...values,
      workspceName: OrganizationData.workspaceId,
      oragnizationUploadedLogo:
        !isEmpty(OrganizationData) && OrganizationData.logo,

      companyAddress:
        !isEmpty(customerStripeObject) && customerStripeObject.address !== null
          ? customerStripeObject.address.line1
          : "",

      state:
        !isEmpty(customerStripeObject) && customerStripeObject.address !== null
          ? customerStripeObject.address.state
          : "",
      city:
        !isEmpty(customerStripeObject) && customerStripeObject.address !== null
          ? customerStripeObject.address.city
          : "",

      pincode:
        !isEmpty(customerStripeObject) && customerStripeObject.address !== null
          ? customerStripeObject.address.postal_code
          : "",

      country:
        !isEmpty(customerStripeObject) && customerStripeObject.address !== null
          ? customerStripeObject.address.country
          : "",
      fileName: !isEmpty(OrganizationData) && OrganizationData.logo,
    });
  }, []);

  const onchangeHandler = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };
  // pincode
  const onchangeHandlerNumber = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.validity.valid ? e.target.value : "",
    });
  };

  const handleOnChangeFile = (e) => {
    e.preventDefault();
    // const data = new FormData();

    // data.append("file", e.target.files[0]);
    // this.setState({
    //   fileData: data
    // });
    const data = new FormData();
    // data.append("image", e.target.files[0].name);
    data.append("file", e.target.files[0]);

    this.props.uploadOrganizationImage(data);
    setValues({
      ...values,
      fileName:
        e.target.files.length > 0 ? e.target.files[0].name : e.target.value,
    });

    console.log(
      "Upload file:",
      e.target.files.length > 0 ? e.target.files[0].name : e.target.value
    );
  };

  const saveWorkspaceInfoHandler = (e) => {
    e.preventDefault();
    let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));
    // const { errors, isValid } = validateProfileWorkspaceInfo(this.state);
    // if (!isValid) {
    //   this.setState({ workspaceErrors: errors });
    // } else {
    // this.setState({ workspaceErrors: {} });
    // console.log("Save workspace info: ", this.state);
    const organizationDetails = OrganizationData;

    organizationDetails.logo = values.oragnizationUploadedLogo;
    organizationDetails.address.state = values.state;

    // console.log(organizationDetails);
    // this.props.updateOrganizationAddress(
    //   this.props.organizationId,
    //   organizationDetails,
    //   "Organization Updated"
    // );
    const formData = {
      customerId: OrganizationData.customerId,
      payLoad: {
        address: {
          city: values.city,
          country: values.country,
          line1: values.companyAddress,
          line2: null,
          postal_code: values.pincode,
          state: values.state,
        },
      },
    };

    dispatch(updateCustomerAddress(formData));
    dispatch(
      updateOrganizationAddress(OrganizationData._id, organizationDetails)
    );
  };
  const percentage = 82;
  return (
    <>
      <div className="edit-profile-form-container edit-profile-form-container--workspace">
        <form noValidate onSubmit={saveWorkspaceInfoHandler}>
          <div className="row mx-0 align-items-start flex-nwrap">
            <div className="col-9">
              <div className="row mx-0">
                {/* Workspace Name */}
                <div className="col-12 pl-0">
                  <InputFieldEmailTextPassword
                    containerClassName="container-login-flow-input container-login-flow-input--forms"
                    //label="workspace name"
                    placeholder="workspace name"
                    name="workspceName"
                    value={values.workspceName}
                    type="text"
                    isReadOnly={true}
                  />
                </div>
              </div>
              <div className="row mx-0 align-items-start flex-nowrap">
                {/* company address */}
                <div className="col-8 pl-0">
                  <InputFieldEmailTextPassword
                    containerClassName="container-login-flow-input container-login-flow-input--forms container-login-flow-input--forms--workspace-company-name"
                    //label="company "
                    placeholder="Head Office Address"
                    name="companyAddress"
                    value={values.companyAddress}
                    onChange={onchangeHandler}
                    type="text"
                    //maxLength={maxLengths.char30}
                  />
                  {/*<label htmlFor="companyAddress">Company Address</label>
                  <input
                    type="text"
                    name="companyAddress"
                    onChange={onchangeHandler}
                    value={values.companyAddress}
  />*/}
                  {/* {workspaceErrors.companyAddress && (
                  <div className="is-invalid add-lead-form-field-errors ml-3">
                    {workspaceErrors.companyAddress}
                  </div>
                )} */}
                </div>

                {/* city */}
                <div className="col-4 pl-0">
                  <InputFieldEmailTextPassword
                    containerClassName="container-login-flow-input container-login-flow-input--forms"
                    //label="company "
                    placeholder="city"
                    name="city"
                    value={values.city}
                    onChange={onchangeHandler}
                    type="text"
                    //maxLength={maxLengths.char30}
                  />
                  {/*<label htmlFor="city">City</label>
                  <input
                    type="text"
                    name="city"
                    onChange={onchangeHandler}
                    value={values.city}
              />*/}
                  {/* {workspaceErrors.city && (
                  <div className="is-invalid add-lead-form-field-errors ml-3">
                    {workspaceErrors.city}
                  </div>
                )} */}
                </div>
              </div>

              <div className="row mx-0 align-items-start flex-nowrap">
                {/* state */}
                <div className="col-4 px-0">
                  <InputFieldEmailTextPassword
                    containerClassName="container-login-flow-input container-login-flow-input--forms"
                    //label="state"
                    placeholder="State"
                    name="state"
                    value={values.state}
                    onChange={onchangeHandler}
                    type="text"
                    //maxLength={maxLengths.char30}
                  />
                  {/*<label htmlFor="state">State</label>
                  <input
                    type="text"
                    name="state"
                    onChange={onchangeHandler}
                    value={values.state}
              />*/}
                  {/* {workspaceErrors.state && (
                  <div className="is-invalid add-lead-form-field-errors ml-3">
                    {workspaceErrors.state}
                  </div>
                )} */}
                </div>

                {/* country */}
                <div className="col-4 px-0">
                  <InputFieldEmailTextPassword
                    containerClassName="container-login-flow-input container-login-flow-input--forms"
                    //label="company "
                    placeholder="Country"
                    name="country"
                    value={values.country}
                    onChange={onchangeHandler}
                    type="text"
                    //maxLength={maxLengths.char30}
                  />
                  {/*<label htmlFor="country">Country</label>
                  <input
                    type="text"
                    name="country"
                    onChange={onchangeHandler}
                    value={values.country}
              />*/}
                  {/* {workspaceErrors.country && (
                  <div className="is-invalid add-lead-form-field-errors ml-3">
                    {workspaceErrors.country}
                  </div>
                )} */}
                </div>

                {/* pincode */}
                <div className="col-4 pl-0">
                  <InputFieldNumber
                    containerClassName="container-login-flow-input container-login-flow-input--forms"
                    name="pincode"
                    value={values.pincode}
                    onChange={onchangeHandlerNumber}
                    maxLength={6}
                  />
                  {/*<label htmlFor="pincode">Pincode</label>
                  <input
                    type="text"
                    pattern="[0-9]*"
                    name="pincode"
                    onChange={onchangeHandlerNumber}
                    value={values.pincode}
                    maxLength={6}
              />*/}
                  {/* {workspaceErrors.pincode && (
                  <div className="is-invalid add-lead-form-field-errors ml-3">
                    {workspaceErrors.pincode}
                  </div>
                )} */}
                </div>
              </div>
              <div className="col-3 px-0">
                <h5 className="font-18-bold-space-light-uppercase">
                  workspace setup
                </h5>
                <div className="workspace-setup-circlur-div">
                  <CircularProgressbar
                    value={percentage}
                    text={`${percentage}%`}
                    strokeWidth={15}
                    styles={{
                      trailColor: "transperant",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="login-next-green-btn login-next-green-btn--finit-setup"
                >
                  Finish Setup
                </button>
              </div>
            </div>
            <div className="col-3">
              {/*<label className="add-lead-label font-24-semibold">
                Default Company Logo
              </label>*/}
              {/*<div className="row mx-0 flex-nowrap align-items-center">
                {/* display logo 
                <div className="profile-info-tab-logo-block">
                  <div className="add-quotation-final-modal-logo">
                    {/* {!isEmpty(this.state.fileName) && (
                    <img
                      src={`${this.state.oragnizationUploadedLogo}&token=${dataToken.token}`}
                      alt="logo"
                    />
                    )} }
                  </div>
                </div>
                <div>*/}
              {/* select image file */}
              {/*<div className="quotation-upload-img-block">
                    <button className="quotation-upload-img__btn">
                      Upload Logo
                    </button>
                    {/* {isEmpty(this.state.fileName) && workspaceErrors.fileName && (
                    <div className="is-invalid add-lead-form-field-errors ml-3">
                      {workspaceErrors.fileName}
                    </div>
                    )} */}

              {/*<input
                      type="file"
                      accept="image/jpeg, image/png"
                      title=""
                      className="font-21-regular quotation-upload-img__input"
                      onChange={handleOnChangeFile}
                    />
                  </div>*/}
              <UploadImage
                containerClassName="upload-img__mainBlock upload-img__mainBlock--setting-tab"
                buttonName="Upload logo"
                //fileNameValue={values.fileNameCoverImg}
                acceptType="image/jpeg, image/png"
                onChange={handleOnChangeFile}
              />
            </div>
            {/*</div>
            </div>*/}
          </div>
        </form>
      </div>
    </>
  );
}

export default WorkspaceDetailTab;
