import React, { Fragment, useState, useEffect } from "react";
import { maxLengths } from "./../../../store/validations/maxLengths/MaxLengths";
import { useDispatch } from "react-redux";
import { updateUser } from "./../../../store/actions/authAction";
import UploadImage from "../common/UploadImage";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import ChangePasswordPopup from "../popups/ChangePasswordPopup";

function SettingTab() {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    email: "",
    workspceName: "",
    fname: "",
    lname: "",
    fileNameCoverImg: "",
    role: "",
  });

  useEffect(() => {
    var userData = JSON.parse(localStorage.getItem("UserData"));
    setValues({
      ...values,
      fname: userData.firstName,
      lname: userData.lastName,
      email: userData.email,
      workspceName: userData.workspaceId + ".remote-teams.io/",
      role: userData.role.name,
    });
  }, []);

  const onchangeHandler = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnChangeUploadImgCoverImage = (e) => {
    e.preventDefault();
    const data = new FormData();
    // data.append("image", e.target.files[0].name);
    data.append("file", e.target.files[0]);
    setValues({
      fileNameCoverImg:
        e.target.files.length > 0
          ? URL.createObjectURL(e.target.files[0])
          : e.target.value,
    });
  };

  /*==============================
        Form event Hndler
  ===============================*/

  const editProfileHandler = (e) => {
    var userData = JSON.parse(localStorage.getItem("UserData"));
    e.preventDefault();
    // const { errors, isValid } = validateProfileSettings(this.state);
    // if (!isValid) {
    //   this.setState({ settingsErrors: errors });
    // } else {
    const updateUserFormData = {
      firstName: values.fname,
      lastName: values.lname,
    };

    // this.setState({ settingsErrors: {} });

    dispatch(updateUser(userData.id, updateUserFormData));
    // console.log(this.state);
  };

  return (
    <div className="row mx-0 align-items-start setting-tab-div">
      <div className="col-2 p-0">
        <UploadImage
          containerClassName="upload-img__mainBlock upload-img__mainBlock--setting-tab"
          buttonName="Upload Image"
          fileNameValue={values.fileNameCoverImg}
          acceptType="image/jpeg, image/png"
          onChange={handleOnChangeUploadImgCoverImage}
        />
      </div>
      <div className="col-10 p-0">
        <h5 className="profile-details-section-title">PERSONAL DETAILS</h5>
        <div className="edit-profile-form-container ">
          <form noValidate onSubmit={editProfileHandler}>
            <div className="row mx-0 align-items-start">
              {/* first name */}
              <div className="col-4 pl-0">
                <InputFieldEmailTextPassword
                  containerClassName="container-login-flow-input container-login-flow-input--forms"
                  //label="First name"
                  placeholder="First name"
                  name="fname"
                  value={values.fname}
                  onChange={onchangeHandler}
                  type="text"
                  maxLength={maxLengths.char30}
                />
              </div>

              {/*<div className="form-group">
              <label htmlFor="fname">First Name</label>
              <input
                type="text"
                name="fname"
                onChange={onchangeHandler}
                maxLength={maxLengths.char30}
                value={values.fname}
              />
              {/* {settingsErrors.fname && (
                <div className="is-invalid add-lead-form-field-errors ml-3">
                  {settingsErrors.fname}
                </div>
              )} 
            </div>*/}

              {/* Last Name */}
              <div className="col-4 pl-0">
                <InputFieldEmailTextPassword
                  containerClassName="container-login-flow-input container-login-flow-input--forms"
                  //label="Last name"
                  placeholder="Last name"
                  name="lname"
                  value={values.lname}
                  onChange={onchangeHandler}
                  type="text"
                  maxLength={maxLengths.char30}
                />
              </div>
              {/*<div className="form-group">
              <label htmlFor="lname">Last Name</label>
              <input
                type="text"
                name="lname"
                onChange={onchangeHandler}
                maxLength={maxLengths.char30}
                value={values.lname}
              />

              {/* {settingsErrors.lname && (
                <div className="is-invalid add-lead-form-field-errors ml-3">
                  {settingsErrors.lname}
                </div>
              )} 
            </div>*/}
              {/* Password Reset */}
              {/* <div className="form-group">
              <label htmlFor="resetPassword">Reset Password</label>
              <input type="password" name="password" />
            </div> */}

              {/* Email */}
              <div className="col-4 pl-0">
                <InputFieldEmailTextPassword
                  containerClassName="container-login-flow-input container-login-flow-input--forms"
                  //label="email"
                  placeholder="Email"
                  name="email"
                  value={values.email}
                  //onChange={onchangeHandler}
                  type="email"
                  isReadOnly={true}
                  //maxLength={maxLengths.char30}
                />
              </div>
              {/*<div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="disabled-field"
                name="email"
                value={values.email}
                disabled
              />
        </div>*/}
              {/* role */}
              <div className="col-4 pl-0">
                <InputFieldEmailTextPassword
                  containerClassName="container-login-flow-input container-login-flow-input--forms"
                  //label="Role"
                  placeholder="Role"
                  name="role"
                  value={values.role}
                  // onChange={onchangeHandler}
                  type="text"
                  maxLength={maxLengths.char30}
                  isReadOnly={true}
                />
              </div>

              {/* Workspace Name */}
              <div className="col-4 pl-0">
                <InputFieldEmailTextPassword
                  containerClassName="container-login-flow-input container-login-flow-input--forms"
                  //label="Last name"
                  placeholder="workspace name"
                  name="workspceName"
                  value={values.workspceName}
                  //onChange={onchangeHandler}
                  type="text"
                  isReadOnly={true}
                  //maxLength={maxLengths.char30}
                />
              </div>
              {/*<div className="form-group">
              <label htmlFor="workspaceName">Workspace Name</label>
              <input
                type="text"
                name="workspceName"
                className="disabled-field"
                value={values.workspceName}
                disabled
              />
          </div>*/}
            </div>
            <div className="row mx-0">
              <div className="text-right col-11">
                <GreenButtonSmallFont
                  text={"Save"}
                  onClick={editProfileHandler}
                />
                {/*<button type="submit">Save</button>*/}
              </div>
            </div>
            <div>
              <h5 className="profile-details-section-title">PASSWORD</h5>
              <ChangePasswordPopup />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SettingTab;
