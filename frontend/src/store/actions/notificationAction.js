import axios from "axios";
import { url, workspaceId } from "./config";
import setAuthToken from "./../utils/setAuthToken";
import Toast from "light-toast";
import { SET_ALL_NOTIFICATIONS, SET_ALL_ANNOUNCEMENT } from "./../types";
import isEmpty from "../validations/is-empty";

/*===================================================================================================
                                            Notification section
====================================================================================================*/

/*====================================================
                  Get all notifications
======================================================*/

export const getAllNotifications = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/notifications?pageSize=200&pageNo=1`,
      {
        headers: headers,
      }
    );
    if (data) {
      // console.log(data);
      // var userData = JSON.parse(localStorage.getItem("UserData"));
      // let loginUserNotification = [];
      // let filterData = data.forEach((notification) => {
      //   // console.log(notification);
      //   if (notification.notificationType !== "ANNOUNCEMENT") {
      //     let notificationForUsers = notification.notification.attendees;
      //     if (!isEmpty(notificationForUsers)) {
      //       let filterUsers = notificationForUsers.filter(
      //         (user) => user === userData.id
      //       );
      //       // console.log(filterUsers);
      //       if (!isEmpty(filterUsers)) {
      //         loginUserNotification.push(notification);
      //       }
      //     }
      //     // console.log(loginUserNotification);
      //   }
      // });

      dispatch({
        type: SET_ALL_NOTIFICATIONS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================
               UPDATE NOTIFICATION
======================================================*/

export const updateNotificationById = (notificationId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.put(
      `${url}/api/notifications/${notificationId}/read`,

      {
        headers: headers,
      }
    );
    if (data) {
      Toast.info("Marked as read", 3000);
      dispatch(getAllNotifications());
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================
                Get all Announcement
======================================================*/

export const getAllAnnouncement = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/notifications/announcement`, {
      headers: headers,
    });
    if (data) {
      // console.log(data);
      // let filterData = data.filter(
      //   (notification) => notification.notificationType === "ANNOUNCEMENT"
      // );
      dispatch({
        type: SET_ALL_ANNOUNCEMENT,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===================================================================================================
                                     Announcement section
====================================================================================================*/

/*====================================================
              Create Announcement
======================================================*/

export const createAnnouncement = (
  formData,
  callBackCreateAnnouncement
) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.post(
      `${url}/api/notifications/announcement`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      Toast.info("Announcement Created", 3000);
      callBackCreateAnnouncement(status);
      // console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};
