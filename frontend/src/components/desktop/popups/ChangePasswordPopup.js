import React, { useState } from "react";
import Modal from "react-responsive-modal";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import InputFieldEmailTextPassword from "./../common/InputFieldEmailTextPassword";
import { useDispatch } from "react-redux";
import {
  userComparePassword,
  userUpdatePassword,
} from "./../../../store/actions/authAction";
import { workspaceId } from "./../../../store/actions/config";
import { useHistory } from "react-router-dom";
import {
  validateChangePassword,
  validateNewPassword,
} from "../../../store/validations/authValidation/ChangePasswordValidation";
import isEmpty from "../../../store/validations/is-empty";

export default function ChangePasswordPopup() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [open, setOpen] = useState(false);

  const [openNewPassword, setOpenNewPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [values, setValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmePassword: "",
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenNewPasswoed = () => {
    setOpenNewPassword(true);
  };

  const handleCloseNewPassword = () => {
    setOpenNewPassword(true);
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
    setErrors({});
  };

  const callBackComparePassword = (status) => {
    if (status === true) {
      setOpen(false);
      setErrors({});
      setOpenNewPassword(true);
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    // console.log(values);
    var userData = JSON.parse(localStorage.getItem("UserData"));
    const { errors, isValid } = validateChangePassword(values);
    // console.log(errors);
    if (!isValid) {
      setErrors(errors);
    } else {
      const formData = {
        password: values.currentPassword,
        email: userData.email,
        workspace: workspaceId,
      };
      dispatch(userComparePassword(formData, callBackComparePassword));
    }
    // setOpenNewPassword(true);
  };

  const callBackUpdatePassword = (status) => {
    if (status === 200) {
      setOpenNewPassword(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log(values);

    var userData = JSON.parse(localStorage.getItem("UserData"));
    const { errors, isValid } = validateNewPassword(values);
    if (!isValid) {
      setErrors(errors);
    } else {
      const formData = {
        email: userData.email,
        password: values.newPassword,
      };
      dispatch(userUpdatePassword(formData, callBackUpdatePassword));
    }
    // setErrors({});
  };

  const forgetPasswordHandler = () => {
    history.push("/forgot-password");
  };

  const renderModal = () => {
    return (
      <div>
        <Modal
          open={openNewPassword}
          onClose={handleCloseNewPassword}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal customModal--change-password",
            closeButton: "customCloseButton",
          }}
        >
          <span className="closeIconInModal" onClick={handleCloseNewPassword} />

          {/* logo */}
          <div className="change-password-div text-center">
            <h3 className="font-24-extraBold-montserrat-letter-spacing change-password-title ">
              Change your password
            </h3>
            <p className="font-18-regular pt-20">
              Great! Now enter your new password
            </p>
            <div className="pt-65">
              <h4 className="font-13-bold text-left color-white-79">
                Enter New Password
              </h4>
              <InputFieldEmailTextPassword
                containerClassName="container-login-flow-input container-login-flow-input--change-password"
                // label="First Name"
                placeholder="**************"
                name="newPassword"
                value={values.newPassword}
                onChange={handleChange}
                type="password"
                //placeholder="Ex. Akshay"
                error={!isEmpty(errors) && errors.newPassword}
              />{" "}
            </div>
            <div className="pt-10">
              <h4 className="font-13-bold color-white-79 text-left">
                Confirm Your Password
              </h4>
              <InputFieldEmailTextPassword
                containerClassName="container-login-flow-input container-login-flow-input--change-password"
                // label="First Name"
                placeholder="**************"
                name="confirmePassword"
                value={values.confirmePassword}
                onChange={handleChange}
                type="password"
                //placeholder="Ex. Akshay"
                error={!isEmpty(errors) && errors.confirmePassword}
              />{" "}
            </div>
            <GreenButtonSmallFont
              text="Set New Password"
              extraClassName="change-password-verify-btn"
              onClick={handleSave}
            />
          </div>
        </Modal>
      </div>
    );
  };
  return (
    <div>
      <GreenButtonSmallFont
        text="Change Password"
        onClick={handleOpen}
        extraClassName="change-password-btn"
      />
      <Modal
        open={open}
        onClose={handleClose}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--change-password",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={handleClose} />

        {/* logo */}
        <div className="change-password-div text-center">
          <h3 className="font-24-extraBold-montserrat-letter-spacing change-password-title">
            Change your password
          </h3>
          <p className="font-18-regular mt-40">
            Before Proceeding kindly verify its you
          </p>
          <div>
            <div className="row mx-0 align-items-center pt-65 justify-content-between">
              <h4 className="font-13-bold color-white-79">
                Enter Current Password
              </h4>
              <h5
                onClick={forgetPasswordHandler}
                className="font-14-semibold change-password-forgot-text"
              >
                Forgot password?{" "}
              </h5>
            </div>
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--change-password"
              label="First Name"
              placeholder="**************"
              name="currentPassword"
              value={values.currentPassword}
              onChange={handleChange}
              type="password"
              //placeholder="Ex. Akshay"
              error={!isEmpty(errors) && errors.currentPassword}
            />
          </div>
          <GreenButtonSmallFont
            text="Verify"
            extraClassName="change-password-verify-btn"
            onClick={handleVerify}
          />
        </div>
      </Modal>
      {renderModal()}
    </div>
  );
}
