import React, { useState } from "react";
import GoogleSocialLogin from "react-google-login";

function GoogleSocial({ responseGoogle, signup }) {
  const [googleResponse, setgoogleResponse] = useState({});

  return (
    <div>
      <GoogleSocialLogin
        clientId="86740850114-drvia9qrdhi0htflvl737sddas3t993p.apps.googleusercontent.com"
        autoLoad={false}
        // buttonText="Login"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={"single_host_origin"}
        icon={false}
        className="google-social-login-div"
      >
        <div className="row mx-0 align-items-center google-social-login-inner-div">
          <div className="google-social-google-icon-div">
            <img
              src={require("../../../assets/img/auth/google-icon.svg")}
              alt=""
              className="google-icon-img"
            />
            {/*<i className="fa fa-google" aria-hidden="true"></i>*/}
          </div>
          <span className="google-social-google-text">
            {" "}
            {signup === true ? "Sign Up" : "Sign In"} with Google
          </span>
        </div>
      </GoogleSocialLogin>
    </div>
  );
}

export default GoogleSocial;
