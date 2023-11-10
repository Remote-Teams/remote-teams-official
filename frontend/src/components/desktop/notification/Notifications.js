import React, { Component } from "react";
import LeftNavbar from "../header/LeftNavbar";
import PageTitle from "../common/PageTitle";
import TopNavbar from "../header/TopNavbar";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import NotificationsAll from "./NotificationsAll";
import NotificationTickets from "./NotificationTickets";
import NotificationsMeetings from "./NotificationsMeetings";
import NotificationsProjects from "./NotificationsProjects";
import io from "socket.io-client";
import isEmpty from "../../../store/validations/is-empty";
import { connect } from "react-redux";
import {
  getAllNotifications,
  updateNotificationById,
} from "./../../../store/actions/notificationAction";
import { notifications } from "./../../../store/actions/socketAction";
import { SET_NEW_NOTIFICATION_STATUS } from "./../../../store/types";
import store from "../../../store/store";

class Notifications extends Component {
  constructor() {
    super();
    this.state = {
      allNotifications: [],
      meetingNotifications: [],
      projectNotifications: [],
      ticketNotifications: [],
    };

    notifications((data) => {
      let previousAllNotifications = this.state.allNotifications;
      this.setState({
        allNotifications: previousAllNotifications.push(data),
      });
      console.log(previousAllNotifications);
    });
  }

  /*=================================================================
      lifecycle methods
  ==================================================================*/
  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allNotifications) &&
      nextProps.allNotifications !== nextState.allNotifications
    ) {
      let meetingNotifications = nextProps.allNotifications.filter(
        (notification) => notification.notificationType === "MEETING_CREATED"
      );
      let projectNotifications = nextProps.allNotifications.filter(
        (notification) => notification.notificationType === "PROJECT_CREATED"
      );
      let ticketNotifications = nextProps.allNotifications.filter(
        (notification) => notification.notificationType === "TICKETS_UPDATE"
      );
      return {
        allNotifications: nextProps.allNotifications,
        meetingNotifications: meetingNotifications,
        projectNotifications: projectNotifications,
        ticketNotifications: ticketNotifications,
      };
    }
    return null;
  }

  componentDidMount() {
    this.props.getAllNotifications();
  }

  componentWillUnmount() {
    // activeNotificationTabIndex
    localStorage.removeItem("newNotification");
    store.dispatch({
      type: SET_NEW_NOTIFICATION_STATUS,
      payload: false,
    });
    localStorage.removeItem("activeNotificationTabIndex");
  }

  /*=================================================================
      handlers
  ==================================================================*/

  handleOnSelect = (val) => {
    // activeNotificationTabIndex
    localStorage.setItem("activeNotificationTabIndex", val);
  };

  markAsReadHandler = (data) => (e) => {
    console.log(data);
    this.props.updateNotificationById(data._id);
  };

  renderAllNotifications = () => {
    const { allNotifications } = this.state;

    return (
      <div className="notifications-all-div">
        {!isEmpty(allNotifications) &&
          allNotifications.map((val, key) => (
            <div key={key} className="notifications-all-text-div">
              {val.notificationType === "ANNOUNCEMENT" ? (
                <h5 className="annocement-all-user">
                  You have received a{" "}
                  <span style={{ color: "#8FD3F4" }}>Announcement</span> invite
                  yet
                </h5>
              ) : val.notificationType === "TICKETS_UPDATE" ? (
                <h5 className="annocement-all-user">
                  You have received a{" "}
                  <span style={{ color: "#8FD3F4" }}>Ticket</span> invite yet
                  with title{" "}
                  <span style={{ color: "#FCB69F" }}>
                    {val.notification.subject}
                  </span>
                </h5>
              ) : val.notificationType === "MEETING_CREATED" ? (
                <h5 className="annocement-all-user">
                  You have received a{" "}
                  <span style={{ color: "#8FD3F4" }}>Meeting</span> invite yet
                  with title{" "}
                  <span style={{ color: "#FCB69F" }}>
                    {val.notification.subject}
                  </span>
                </h5>
              ) : val.notificationType === "PROJECT_CREATED" ? (
                <h5 className="annocement-all-user">
                  <span style={{ color: "#8FD3F4" }}>Akshay</span> Mapped To You
                  Project{" "}
                  <span style={{ color: "#FCB69F" }}>
                    {val.notification.name}
                  </span>
                </h5>
              ) : (
                "new"
              )}

              <h5
                onClick={this.markAsReadHandler(val)}
                className="annocement-all-check"
              >
                Mark as read
              </h5>
            </div>
          ))}
      </div>
    );
  };

  renderProjectNotifications = () => {
    const { projectNotifications } = this.state;
    return (
      <div>
        {!isEmpty(projectNotifications) ? (
          projectNotifications.map((val, key) => (
            <div key={key} className="notifications-all-text-div">
              <h5 className="annocement-all-user">
                <span style={{ color: "#8FD3F4" }}>Akshay</span> Mapped To You
                Project{" "}
                <span style={{ color: "#FCB69F" }}>
                  {val.notification.name}
                </span>
              </h5>
              <h5
                onClick={this.markAsReadHandler(val)}
                className="annocement-all-check"
              >
                Mark as read
              </h5>
            </div>
          ))
        ) : (
          <h3 className="font-14-semibold table-data-empty-message announcement-empty-message">
            There are no project invites yet
          </h3>
        )}
      </div>
    );
  };

  renderMeetingNotifications = () => {
    const { meetingNotifications } = this.state;
    return (
      <div>
        {!isEmpty(meetingNotifications) ? (
          meetingNotifications.map((val, key) => (
            <div key={key} className="notifications-all-text-div">
              <h5 className="annocement-all-user">
                You have received a{" "}
                <span style={{ color: "#8FD3F4" }}>Meeting</span> invite yet
                with title{" "}
                <span style={{ color: "#FCB69F" }}>
                  {val.notification.subject}
                </span>
              </h5>
              <h5
                onClick={this.markAsReadHandler(val)}
                className="annocement-all-check"
              >
                Mark as read
              </h5>
            </div>
          ))
        ) : (
          <h3 className="font-14-semibold table-data-empty-message announcement-empty-message">
            There are no meeting invites yet
          </h3>
        )}
      </div>
    );
  };

  renderTicketNotifications = () => {
    const { ticketNotifications } = this.state;
    return (
      <div>
        {!isEmpty(ticketNotifications) ? (
          ticketNotifications.map((val, key) => (
            <div key={key} className="notifications-all-text-div">
              <h5 className="annocement-all-user">
                You have received a{" "}
                <span style={{ color: "#8FD3F4" }}>Ticket</span> invites yet
                with ticket title <span style={{ color: "#FCB69F" }}>sd</span>
              </h5>
              <h5
                onClick={this.markAsReadHandler(val)}
                className="annocement-all-check"
              >
                Mark as read
              </h5>
            </div>
          ))
        ) : (
          <h3 className="font-14-semibold table-data-empty-message announcement-empty-message">
            There are no ticket invites yet
          </h3>
        )}
      </div>
    );
  };

  render() {
    const {
      allNotifications,
      meetingNotifications,
      projectNotifications,
      ticketNotifications,
    } = this.state;
    return (
      <>
        {/* left navbar */}
        <LeftNavbar />

        <div className="main-page-padding">
          {/* pagetitle and topnavbar */}
          <div className="pageTitle-topNavbar-div">
            <PageTitle title="notifications" />
            <TopNavbar activeMenu={"notifications"} />
          </div>

          {/* pagetitle and topnavbar end */}
          <div className="profile_tabs_section profile_tabs_section--shadow-simple-tabs profile_tabs_section--notification">
            <Tabs
              defaultIndex={parseInt(
                localStorage.getItem("activeNotificationTabIndex")
              )}
              onSelect={this.handleOnSelect}
            >
              <TabList>
                <Tab>All({allNotifications.length})</Tab>
                <Tab>Projects ({projectNotifications.length})</Tab>

                <Tab>Meetings({meetingNotifications.length})</Tab>
                <Tab>Tickets({ticketNotifications.length})</Tab>
              </TabList>

              <TabPanel>
                {/* <NotificationsAll allNotifications={allNotifications} /> */}
                {this.renderAllNotifications()}
              </TabPanel>
              <TabPanel>
                {/* <NotificationsProjects /> */}
                {this.renderProjectNotifications()}
              </TabPanel>

              <TabPanel>
                {/* <NotificationsMeetings /> */}
                {this.renderMeetingNotifications()}
              </TabPanel>
              <TabPanel>
                {/* <NotificationTickets /> */}
                {this.renderTicketNotifications()}
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  allNotifications: state.socket.allNotifications,
});

export default connect(mapStateToProps, {
  getAllNotifications,
  updateNotificationById,
})(Notifications);
