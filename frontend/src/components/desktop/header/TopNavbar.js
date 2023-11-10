import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { logoutUser } from "./../../../store/actions/authAction";
import isEmpty from "../../../store/validations/is-empty";
import { useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

function TopNavbar({ activeMenu }) {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    gotNewMessage: [],
    gotNewAnnouncement: [],
    gotNewNotification: [],
  });

  const gotNewMessage = useSelector((state) => state.socket.gotNewMessage);
  const gotNewAnnouncement = useSelector(
    (state) => state.socket.gotNewAnnouncement
  );
  const gotNewNotification = useSelector(
    (state) => state.socket.gotNewNotification
  );
  const activeWalkthroughPage = useSelector(
    (state) => state.auth.activeWalkthroughPage
  );

  useEffect(() => {
    if (!isEmpty(gotNewMessage)) {
      setValues({
        ...values,
        gotNewMessage: gotNewMessage,
      });
    }
  }, [gotNewMessage]);

  useEffect(() => {
    if (!isEmpty(gotNewAnnouncement)) {
      setValues({
        ...values,
        gotNewAnnouncement: gotNewAnnouncement,
      });
    }
  }, [gotNewAnnouncement]);

  useEffect(() => {
    if (!isEmpty(gotNewNotification)) {
      setValues({
        ...values,
        gotNewNotification: gotNewNotification,
      });
    }
  }, [gotNewNotification]);

  const logoutHandler = () => {
    dispatch(logoutUser());
    history.push("/login");
  };

  return (
    <nav>
      <ul
        className={
          activeWalkthroughPage === "navbar-2"
            ? "top-navbar-ul new-walkthrough-active-topnavbar"
            : "top-navbar-ul"
        }
      >
        {/* timesheet */}
        {/* <li>
            <div
              className={
                this.props.activeWalkthroughPage === "timesheet-1"
                  ? "new-walkthrough-active-buttton-add-new"
                  : ""
              }
            >
              <Link to="/timesheet">
                <span
                  className={
                    this.props.activeMenu === "timesheet"
                      ? "login-dashboard-btn login-dashboard-btn--timesheet login-dashboard-btn--timesheet-active"
                      : "login-dashboard-btn login-dashboard-btn--timesheet"
                  }
                >
                  <img
                    //src={require("../../../assets/img/icons/timesheet-icon.svg")}
                    src={require("../../../assets/img/icons/new-timesheet-icon.svg")}
                    alt="timesheet"
                    className="top-navbar-ul__btn-timesheet-img"
                  />
                  Timesheet
                </span>
              </Link>
            </div>
          </li>
           */}
        {/* calendar */}
        <li>
          <Link to="/calendar">
            <span
              className={
                activeMenu === "calendar"
                  ? "login-dashboard-btn login-dashboard-btn--calendar login-dashboard-btn--calendar-active"
                  : "login-dashboard-btn login-dashboard-btn--calendar"
              }
            >
              <img
                //src={require("../../../assets/img/icons/calendar-icon.svg")}
                src={require("../../../assets/img/icons/new-calendar-icon.svg")}
                alt="calendar"
                className="top-navbar-ul__btn-calendar-img"
              />
              Calendar
            </span>
          </Link>
        </li>

        {/* notes */}
        <li>
          <Link to="/notes">
            {activeMenu === "notes" ? (
              <img
                //src={require("../../../assets/img/icons/notes-icon.svg")}
                src={require("../../../assets/img/icons/new-notes-active-icon.svg")}
                alt="notes"
                className="top-navbar-ul__btn-notes-img"
              />
            ) : (
              <img
                src={require("../../../assets/img/icons/new-notes-icon.svg")}
                alt="notes"
                className="top-navbar-ul__btn-notes-img"
              />
            )}
          </Link>
        </li>

        {/* presentation */}
        <li>
          <Link to="/announcement">
            <span className="top-navbar-ul__icon-and-circle">
              {activeMenu === "announcement" ? (
                <img
                  //src={require("../../../assets/img/icons/presentation-icon.svg")}
                  src={require("../../../assets/img/icons/new-presentation-active-icon.svg")}
                  alt="presentation"
                  className="top-navbar-ul__btn-notes-img"
                />
              ) : (
                <img
                  src={require("../../../assets/img/icons/new-presentation-icon.svg")}
                  alt="presentation"
                  className="top-navbar-ul__btn-notes-img "
                />
                /**top-navbar-ul__btn-notes-img--presentation */
              )}
              {location.pathname !== "/announcement" &&
                gotNewAnnouncement === true && (
                  <i className="fa fa-circle color-orange"></i>
                )}
            </span>
          </Link>
        </li>

        {/* chat */}
        <li>
          <Link to="/chat">
            <span className="top-navbar-ul__icon-and-circle">
              {activeMenu === "chat" ? (
                <img
                  //src={require("../../../assets/img/icons/chat-icon.svg")}
                  src={require("../../../assets/img/icons/new-chat-active-icon.svg")}
                  alt="chat"
                  className="top-navbar-ul__btn-chat-img"
                />
              ) : (
                <img
                  //src={require("../../../assets/img/icons/chat-icon.svg")}
                  src={require("../../../assets/img/icons/new-chat-icon.svg")}
                  alt="chat"
                  className="top-navbar-ul__btn-chat-img"
                />
              )}
              {location.pathname !== "/chat" && gotNewMessage === true && (
                <i className="fa fa-circle fa-circle--bell"></i>
              )}
            </span>
          </Link>
        </li>
        {/* notification */}
        <li>
          <Link to="/notifications">
            <span className="top-navbar-ul__icon-and-circle">
              {activeMenu === "notifications" ? (
                <img
                  //src={require("../../../assets/img/icons/bell-icon.svg")}
                  src={require("../../../assets/img/icons/new-bell-active-icon.svg")}
                  alt="notification"
                  className="top-navbar-ul__btn-notes-img"
                />
              ) : (
                <img
                  //src={require("../../../assets/img/icons/bell-icon.svg")}
                  src={require("../../../assets/img/icons/new-bell-icon.svg")}
                  alt="notification"
                  className="top-navbar-ul__btn-notes-img"
                />
              )}

              {location.pathname !== "/notifications" &&
                gotNewNotification === true && (
                  <i className="fa fa-circle fa-circle--notification"></i>
                )}
            </span>
          </Link>
        </li>
        {/* profile */}
        <li>
          <Link to="/profile">
            <img
              // src={require("../../../assets/img/dummy/member-female.png")}
              //src={require("../../../assets/img/dummy/access-role-resource.svg")}
              //src={require("../../../assets/img/dummy/selected-member-profile-new.svg")}
              src={require("../../../assets/img/dummy/new-profile-img.svg")}
              alt="profile"
              className="top-navbar-ul__btn-user-img"
            />
          </Link>
        </li>
        {/* logout */}
        <li>
          <img
            onClick={logoutHandler}
            src={require("../../../assets/img/icons/logout-icon.svg")}
            alt="logout"
            className="top-navbar-ul__btn-logout-img"
          />
        </li>
      </ul>
    </nav>
  );
}

export default TopNavbar;
