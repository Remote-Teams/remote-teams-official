import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class AnnoucementAll extends Component {
  render() {
    return (
      <>
        <div className="annocement-text-div">
          <h5 className="annocement-all-user">
            You have received an announcement created by User name
          </h5>
          <Link to="/announcement-check-details">
            <h5 className="annocement-all-check">Check Details</h5>
          </Link>
        </div>
      </>
    );
  }
}
