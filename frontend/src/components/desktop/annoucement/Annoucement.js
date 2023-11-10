import React, { Component } from "react";
import LeftNavbar from "../header/LeftNavbar";
import PageTitle from "../common/PageTitle";
import TopNavbar from "../header/TopNavbar";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import AnnoucementAll from "./AnnoucementAll";
import AnnouncementByMe from "./AnnouncementByMe";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getAllAnnouncement } from "./../../../store/actions/notificationAction";
import isEmpty from "../../../store/validations/is-empty";
import { notifications } from "./../../../store/actions/socketAction";
import Toast from "light-toast";
import { SET_NEW_ANNOUNCEMENT_STATUS } from "./../../../store/types";
import store from "../../../store/store";
import dateFns from "date-fns";

class Annoucement extends Component {
  constructor() {
    super();
    this.state = {
      allAnnouncements: [],
    };
    notifications((data) => {
      console.log(data);
      if (data.notificationType === "ANNOUNCEMENT") {
        let previousAnnouncement = this.state.allAnnouncements;
        this.setState({
          allAnnouncements: previousAnnouncement.unshift(data),
        });
      }
    });
  }

  /*=================================================================
      lifecycle methods
  ==================================================================*/

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allAnnouncements) &&
      nextProps.allAnnouncements !== nextState.allAnnouncements
    ) {
      return {
        allAnnouncements: nextProps.allAnnouncements,
      };
    }

    return null;
  }

  componentDidMount() {
    localStorage.removeItem("newAnnouncement");
    store.dispatch({
      type: SET_NEW_ANNOUNCEMENT_STATUS,
      payload: false,
    });
    this.props.getAllAnnouncement();
  }

  componentWillUnmount() {
    // activeAnnouncementTabIndex
    localStorage.removeItem("newAnnouncement");
    store.dispatch({
      type: SET_NEW_ANNOUNCEMENT_STATUS,
      payload: false,
    });
    localStorage.removeItem("activeAnnouncementTabIndex");
  }

  /*=================================================================
      handlers
  ==================================================================*/

  handleOnSelect = (val) => {
    // activeAnnouncementTabIndex
    localStorage.setItem("activeAnnouncementTabIndex", val);
  };

  render() {
    // console.log(this.state.allAnnouncements);
    const { allAnnouncements } = this.state;
    var userData = JSON.parse(localStorage.getItem("UserData"));
    let createdByMe =
      !isEmpty(allAnnouncements) &&
      allAnnouncements.filter((data) => data.from === userData.id);
    console.log(createdByMe);
    return (
      <>
        {/* left navbar */}
        <LeftNavbar />

        <div className="main-page-padding">
          {/* pagetitle and topnavbar */}
          <div className="pageTitle-topNavbar-div">
            <PageTitle
              title="Annoucements"
              isLinkDisplay={true}
              linkPath="/add-announcement"
              linkText="Add Annoucement"
            />
            <TopNavbar activeMenu={"announcement"} />
          </div>

          {/* pagetitle and topnavbar end */}
          {/* <Link to="/add-announcement">
            <GreenButtonSmallFont
              text="Add Annoucement"
              //text="+ announcement"
              extraClassName="add-annoucement-btn"
            />
          </Link> */}
          <div className="profile_tabs_section profile_tabs_section--shadow-simple-tabs profile_tabs_section--annoucement">
            <Tabs
              defaultIndex={parseInt(
                localStorage.getItem("activeAnnouncementTabIndex")
              )}
              onSelect={this.handleOnSelect}
            >
              <TabList>
                <Tab>All({allAnnouncements.length})</Tab>
                <Tab>Created by me({createdByMe.length})</Tab>
              </TabList>

              <TabPanel>
                <div className="annoucement-all-overflow-div">
                  {!isEmpty(allAnnouncements) ? (
                    allAnnouncements.map((data, index) => {
                      return (
                        <div key={index} className="annocement-text-div">
                          {data.from === userData.id ? (
                            <h5 className="annocement-all-user">
                              You created an announcement <span>on date</span>{" "}
                              {dateFns.format(data.createdAt, "Do MMM")}
                            </h5>
                          ) : (
                            <h5 className="annocement-all-user">
                              You have received an announcement{" "}
                              {/* {data.name.firstName + " " + data.name.lastName} */}
                              on date {dateFns.format(data.createdAt, "Do MMM")}
                            </h5>
                          )}

                          <Link
                            to={{
                              pathname: "/announcement-check-details",
                              state: {
                                announcementData:
                                  data.notification.notification,
                              },
                            }}
                          >
                            <h5 className="annocement-all-check">
                              Check Details
                            </h5>
                          </Link>
                        </div>
                      );
                    })
                  ) : (
                    <h3 className="font-14-semibold table-data-empty-message announcement-empty-message">
                      There have been no announcements yet
                    </h3>
                  )}
                </div>
              </TabPanel>
              <TabPanel>
                {!isEmpty(createdByMe) && createdByMe !== false ? (
                  createdByMe.map((data, index) => {
                    return (
                      <div key={index} className="annocement-text-div">
                        <h5 className="annocement-all-user">
                          You created an announcement <span>on date</span>{" "}
                          {dateFns.format(data.createdAt, "Do MMM")}
                        </h5>
                        <Link
                          to={{
                            pathname: "/announcement-check-details",
                            state: {
                              announcementData: data.notification.notification,
                            },
                          }}
                        >
                          <h5 className="annocement-all-check">
                            Check Details
                          </h5>
                        </Link>
                      </div>
                    );
                  })
                ) : (
                  <h3 className="font-14-semibold table-data-empty-message announcement-empty-message">
                    There have been no announcements yet
                  </h3>
                )}
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  allAnnouncements: state.socket.allAnnouncements,
  newAnnouncement: state.socket.newAnnouncement,
});

export default connect(mapStateToProps, { getAllAnnouncement })(Annoucement);
