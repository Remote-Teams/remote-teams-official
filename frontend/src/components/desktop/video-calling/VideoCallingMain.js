import React, { Component } from "react";
import GreenLinkBigFont from "../common/GreenLinkBigFont";
import PageTitle from "../common/PageTitle";
import VideoCallingScheduleLater from "./VideoCallingScheduleLater";

const dummyData = [1, 2, 3, 4, 5];
const dummyCardData = [1, 2, 3];
export class VideoCallingMain extends Component {
  /*==============================
         handle sort
  ================================*/
  handleSort = (name) => (e) => {
    console.log("sort data of column: ", name);
  };

  /*=========================================

                render Card

  =========================================*/
  renderCard = () => {
    return (
      <div className="video-call-card-div">
        <h1 className="font-18-bold video-call-card--heading">
          Upcoming meeting
        </h1>
        <div className="video-call-card-data">
          {dummyCardData.map((key, data) => (
            <div
              key={key}
              className="row mx-0 justify-content-between video-call-card-data--innerdiv"
            >
              <h5 className="font-18-bold">23/03/20</h5>
              <h5 className="font-18-bold">14:00 PM - 14:30 PM</h5>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /*=========================================
  
                render table

  =========================================*/
  renderTable = () => {
    return (
      <div>
        <div className="finances-table-thead finances-table-thead--video-calling">
          <table className="finances-table finances-table--video-calling">
            <thead>
              <tr>
                <th>
                  <span
                    className="cursor-pointer"
                    onClick={this.handleSort("date")}
                  >
                    Date <i className="fa fa-sort"></i>
                  </span>
                </th>
                <th>
                  <span>Call timings</span>
                </th>
                <th>
                  <span>Scheduled by</span>
                </th>
                <th>
                  <span
                    className="cursor-pointer"
                    onClick={this.handleSort("No of participants")}
                  >
                    No of participants <i className="fa fa-sort"></i>
                  </span>
                </th>
                <th>
                  <span
                    className="cursor-pointer"
                    onClick={this.handleSort("Call duration")}
                  >
                    call duration <i className="fa fa-sort"></i>
                  </span>
                </th>
              </tr>
            </thead>
          </table>
          <div className="finances-table-tbody finances-tbody--video-calling">
            <table className="finances-table finances-table--video-calling">
              <tbody>
                {dummyData.map((key, data) => (
                  <tr key={key}>
                    <td>
                      <span>23/03/20</span>
                    </td>
                    <td>
                      <span>14:00 PM - 14:30 PM</span>
                    </td>
                    <td>
                      <span>member Name</span>
                    </td>
                    <td>
                      <span>2</span>
                    </td>
                    <td>
                      <span>23 Mins</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  /*=========================================
  
                render

  =========================================*/
  render() {
    return (
      <>
        <div className="main-page-padding">
          <div className="pageTitle-topNavbar-div">
            <PageTitle title="conference" />
          </div>
          <div className="row mx-0 align-items-center pt-89">
            <div className="video-calling-home-img-div">
              <img
                src={require("../../../assets/img/video-calling/video-home-img.svg")}
                alt="video calling"
                className="video-calling-home-img"
              />
            </div>
            <div className="video-calling-home-button-div">
              <GreenLinkBigFont
                //text="Start Now"
                text="Start New Meeting"
                path="/video-call-starting"
              />
              {/*<h5 className="font-18-bold pt-30 mb-30">OR</h5>*/}
              <VideoCallingScheduleLater />
            </div>
            {this.renderCard()}
          </div>
          <div className="video-calling-table-outer-div">
            {this.renderTable()}
          </div>
        </div>
      </>
    );
  }
}

export default VideoCallingMain;
