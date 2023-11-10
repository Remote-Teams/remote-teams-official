import React, { Component } from "react";
import PageTitle from "../common/PageTitle";
import LeftNavbar from "../header/LeftNavbar";
import ClientsNewCard from "./ClientsNewCard";

const dummyData = [1, 2, 3, 4, 5, 6, 7];
export class ClientNew extends Component {
  handleBorderColorChange = (e) => {
    //e.preventDefault();
    e.target.className = "green-boder";
    //console.log(e.target);
  };
  render() {
    return (
      <>
        <div className="row mx-0 align-items-start new-clients">
          <div className="clients_new_bg">
            {/* left navbar */}
            <LeftNavbar activeMenu="clients" />

            <div className="main-page-padding">
              {/* pagetitle and topnavbar */}
              <div className="pageTitle-topNavbar-div">
                <PageTitle title="Clients" />
              </div>
              <div className="row  pt-10 mx-0 page-count-row">
                <div className="clients-count-div">
                  <h5 className="clients-count-number">891</h5>
                  <h5 className="clients-count-title">Total Clients</h5>
                </div>
                <div className="clients-count-div">
                  <h5 className="clients-count-number">120</h5>
                  <h5 className="clients-count-title"> active clients</h5>
                </div>
                <div className="clients-count-div">
                  <h5 className="clients-count-number">540</h5>
                  <h5 className="clients-count-title">On hold Clients</h5>
                </div>
              </div>
              <div>
                <div className="row mx-0 pl-30 align-items-start justify-content-start pr-30">
                  <div className="mr-75 mb-40  ">
                    <div
                      className="new-clients-add-new"
                      onClick={(e) => this.handleBorderColorChange(e)}
                    >
                      <div className="clients-add-img-div">
                        <img
                          src={require("../../../assets/img/clients/add.svg")}
                          alt="add"
                          className="clients-add-img"
                        />
                      </div>
                    </div>
                    <h5 className="clients-new-profile-title">Add New </h5>
                  </div>
                  {dummyData.map((key, data) => (
                    <div key={key} className="mr-75 mb-40 ">
                      <div className="new-clients-profile row mx-0 align-items-center justify-content-center">
                        <img
                          src={require("../../../assets/img/clients/client-profile.png")}
                          alt="clients profile"
                          className="clients-profile-img"
                          onClick={(e) => this.handleBorderColorChange(e)}
                        />
                      </div>
                      <h5 className="clients-new-profile-title">
                        Clients name
                      </h5>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="client-new-right">
            <ClientsNewCard />
          </div>
        </div>
      </>
    );
  }
}

export default ClientNew;
