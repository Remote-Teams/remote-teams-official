// import React, { Component } from "react";
// import { connect } from "react-redux";
// import LoginSignup from "./LoginSignup";
// import LoginFlowSelectCompany from "./LoginFlowSelectCompany";
// import LoginFlowDashboard from "./LoginFlowDashboard";

// const loginFlowNext = 2;

// class LoginFlow extends Component {
//   render() {
//     // let { loginFlowNext } = this.props;
//     // console.log(loginFlowNext);
//     return (
//       <>
//         {loginFlowNext === 0 && <LoginSignup />}
//         {loginFlowNext === 1 && <LoginFlowSelectCompany />}
//         {loginFlowNext === 2 && <LoginFlowDashboard />}
//       </>
//     );
//   }
// }

// const mapStateToprops = (state) => ({
//   loginFlowNext: state.auth.loginFlowNext,
// });

// export default connect(mapStateToprops, {})(LoginFlow);
