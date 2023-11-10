import React, { Component } from "react";
import Toggle from "../common/Toggle";

export class ClientsNewCard extends Component {
  render() {
    return (
      <>
        <div className="clients-new-card-inner-div">
          <div className="clients-new-card-profile-img-div">
            <img
              src={require("../../../assets/img/clients/client-profile.png")}
            />
          </div>
          <h2 className="clients-new-profile-title pt-30">Clients name</h2>
        </div>
        <div className="clients-new-profile-info-div">
          <h4 className="clients-count-title pt-0">primary contact</h4>
          <h4 className="clients-card-text">janedoe@mail.com</h4>
          <h4 className="clients-count-title pt-14">primary contact details</h4>
          <h4 className="clients-card-text p-0">+xx xxxxx xxxxx</h4>
          <h4 className="clients-count-title pt-14">projects</h4>
          <h5 className="clients-card-text-small ">dominate</h5>
          <h5 className="clients-card-text-small clients-card-text-small-throtl">
            throtl
          </h5>
          <h4 className="clients-count-title pt-14">Status</h4>
          <div className="clients-new-card-toggle">
            <Toggle
              textClassName="client-new-card-toggle-text"
              name="isStatusActive"
              text1={"Active"}
              text2={"Inactive"}
              onChange={this.handleOnChangeToggle}
              defaultChecked={false}
            />
            {console.log()}
          </div>
        </div>
        <div className="clients-new-card-button-div">
          <button className="clients-new-card-button">Edit</button>
        </div>
      </>
    );
  }
}

export default ClientsNewCard;
