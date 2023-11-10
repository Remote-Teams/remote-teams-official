import React, { Component } from "react";
import { connect } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";

class NotificationTickets extends Component {
  constructor() {
    super();
    this.state = {
      ticketNotifications: [],
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
      let ticketNotifications = nextProps.allNotifications.filter(
        (notification) =>
          notification.notificationType === "TICKET_CREATED" &&
          notification.notificationType === "TICKETS_UPDATE"
      );
      return {
        ticketNotifications: ticketNotifications,
      };
    }
    return null;
  }
  render() {
    const { ticketNotifications } = this.state;
    return (
      <div>
        {!isEmpty(ticketNotifications) ? (
          ticketNotifications.map((val, key) => (
            <div key={key} className="notifications-all-text-div">
              <h5 className="annocement-all-user">
                You have received a ticket invites yet
              </h5>
              {/* <h5 className="annocement-all-check">Add to calender</h5> */}
            </div>
          ))
        ) : (
          <h3 className="font-14-semibold table-data-empty-message announcement-empty-message">
            There are no ticket invites yet
          </h3>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  allNotifications: state.socket.allNotifications,
});

export default connect(mapStateToProps)(NotificationTickets);
