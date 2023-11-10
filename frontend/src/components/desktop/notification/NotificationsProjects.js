import React, { Component } from "react";
import { connect } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";

class NotificationsProjects extends Component {
  constructor() {
    super();
    this.state = {
      projectNotifications: [],
    };
  }

  /*=================================================================
      lifecycle methods
  ==================================================================*/
  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allNotifications) &&
      nextProps.allNotifications !== nextState.allNotifications
    ) {
      let projectNotifications = nextProps.allNotifications.filter(
        (notification) => notification.notificationType === "PROJECT_CREATED"
      );
      return {
        projectNotifications: projectNotifications,
      };
    }
    return null;
  }

  render() {
    const { projectNotifications } = this.state;
    return (
      <div>
        {!isEmpty(projectNotifications) ? (
          projectNotifications.map((val, key) => (
            <div key={key} className="notifications-all-text-div">
              <h5 className="annocement-all-user">
                You have received a project invite
              </h5>
              <h5 className="annocement-all-check">Add to calender</h5>
            </div>
          ))
        ) : (
          <h3 className="font-14-semibold table-data-empty-message announcement-empty-message">
            There are no project invites yet
          </h3>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  allNotifications: state.socket.allNotifications,
});

export default connect(mapStateToProps)(NotificationsProjects);
