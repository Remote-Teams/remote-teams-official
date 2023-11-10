import axios from "axios";
import { url } from "./config";
import { SET_ALL_CHATING_OF_USERS, SET_ALL_CHAT_USERS } from "./../types";

/*=====================================
     Get all Chats Action 
======================================*/
export const getAllChatsAction = (toChatUser, pageNo, pageSizze) => (
  dispatch
) => {
  axios
    .get(`${url}/api/chats/${toChatUser}?pageSize=10&pageNo=1`)
    .then((res) => {
      dispatch({
        type: SET_ALL_CHATING_OF_USERS,
        payload: res.data.reverse(),
      });
    })
    .catch((err) => console.log(err));
};

/*======================================
    Get All Users For chat
========================================*/

export const getAllUsersForChat = (userId, callBack) => (dispatch) => {
  let userData = JSON.parse(localStorage.getItem("UserData"));
  axios
    .get(`${url}/api/chats`)
    .then((res) => {
      if (res.data) {
        let users = res.data.filter(
          (user) => user._id !== userData.id && user.status === "ACTIVE"
        );

        dispatch({
          type: SET_ALL_CHAT_USERS,
          payload: users,
        });
        if (!callBack) {
          dispatch(getAllChatsAction(users[0]._id));
        }

        // dispatch(markChatAsRead(users[0]._id));
      }
    })
    .catch((err) => console.log(err));
};

/*========================================
      Send Message For Ofline Users
==========================================*/

export const sendMessageForOfflinerUser = (formData) => (dispatch) => {
  axios
    .post(`${url}/api/chats`, formData)
    .then((res) => {
      if (res.data) {
        console.log(res.data);
      }
    })
    .catch((err) => console.log(err));
};

/*==============================================
      Update Chat As Read
=================================================*/
export const markChatAsRead = (userId, formData) => (dispatch) => {
  let userData = JSON.parse(localStorage.getItem("UserData"));
  axios
    .put(`${url}/api/chats?id=${userId}`, formData)
    .then((res) => {
      if (res.data) {
        dispatch(getAllUsersForChat(userData.id, true));
      }
    })
    .catch((err) => console.log(err));
};
