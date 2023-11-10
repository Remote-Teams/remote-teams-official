import React, { useEffect } from "react";
import cookie from "react-cookies";
import isEmpty from "./../../../store/validations/is-empty";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { loginUser } from "./../../../store/actions/authAction";

function WorkspaceSocialLogin() {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    let allCookies = cookie.loadAll();

    if (!isEmpty(allCookies.socialLoginInfo)) {
      let parseData = JSON.parse(allCookies.socialLoginInfo);
      // const formData = {
      //   email: parseData.email,
      //   password: parseData.googleId,
      // };
      dispatch(loginUser(parseData, history));
    }
  }, []);
  return (
    <div>
      <Loader type="Triangle" color="#57cba1" className="remote-loader" />
    </div>
  );
}

export default WorkspaceSocialLogin;
