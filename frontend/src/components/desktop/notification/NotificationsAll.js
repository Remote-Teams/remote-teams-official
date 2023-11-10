import React, { Component } from "react";
import { connect } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";

class NotificationsAll extends Component {
  constructor() {
    super();
    this.state = {
      allNotifications: [],
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
      return {
        allNotifications: nextProps.allNotifications,
      };
    }
    return null;
  }

  componentDidUpdate() {
    if (this.props.allNotifications !== this.state.allNotifications) {
      this.setState({
        allNotifications: this.props.allNotifications,
      });
    }
  }

  render() {
    const { allNotifications } = this.state;
    console.log(allNotifications);
    return (
      <>
        <div className="notifications-all-div">
          {!isEmpty(allNotifications) &&
            allNotifications.map((val, key) => (
              <div key={key} className="notifications-all-text-div">
                <h5 className="annocement-all-user">
                  You have received a meeting invite
                </h5>

                <h5 className="annocement-all-check">Add to calender</h5>
              </div>
            ))}
        </div>
      </>
    );
  }
}

// const mapStateToProps = (state) => ({
//   allNotifications: state.socket.allNotifications,
// });

export default connect(null, {})(NotificationsAll);
