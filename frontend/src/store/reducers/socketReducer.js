import {
  SET_ALL_NOTIFICATIONS,
  SET_ALL_ANNOUNCEMENT,
  SET_NEW_MEESAGE_STATUS,
  SET_NEW_ANNOUNCEMENT_STATUS,
  SET_NEW_NOTIFICATION_STATUS,
} from "./../types";

const initialState = {
  allNotifications: [],
  allAnnouncements: [],
  gotNewAnnouncement: false,
  gotNewMessage: false,
  gotNewNotification: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_ALL_NOTIFICATIONS:
      return {
        ...state,
        allNotifications: action.payload,
      };
    case SET_ALL_ANNOUNCEMENT:
      return {
        ...state,
        allAnnouncements: action.payload,
      };
    case SET_NEW_ANNOUNCEMENT_STATUS:
      return {
        ...state,
        gotNewAnnouncement: action.payload,
      };
    case SET_NEW_MEESAGE_STATUS:
      return {
        ...state,
        gotNewMessage: action.payload,
      };
    case SET_NEW_NOTIFICATION_STATUS:
      return {
        ...state,
        gotNewNotification: action.payload,
      };
    default:
      return state;
  }
}
