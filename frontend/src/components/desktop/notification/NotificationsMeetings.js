import React, { Component } from "react";
import { connect } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";

class NotificationsMeetings extends Component {
  constructor() {
    super();
    this.state = {
      meetingNotifications: [],
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
      let meetingNotifications = nextProps.allNotifications.filter(
        (notification) => notification.notificationType === "MEETING_CREATED"
      );
      return {
        meetingNotifications: meetingNotifications,
      };
    }
    return null;
  }
  render() {
    const { meetingNotifications } = this.state;
    return (
      <div>
        {!isEmpty(meetingNotifications) ? (
          meetingNotifications.map((val, key) => (
            <div key={key} className="notifications-all-text-div">
              <h5 className="annocement-all-user">
                You have received a meeting invite
              </h5>
              <h5 className="annocement-all-check">Add to calender</h5>
            </div>
          ))
        ) : (
          <h3 className="font-14-semibold table-data-empty-message announcement-empty-message">
            There are no meeting invites yet
          </h3>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  allNotifications: state.socket.allNotifications,
});

export default connect(mapStateToProps, {})(NotificationsMeetings);
