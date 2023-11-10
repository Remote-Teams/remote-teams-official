import axios from "axios";
import Alert from "react-s-alert";
import { url } from "../../../../../store/actions/config";
import {
  SET_AUTH_LOADER,
  SET_ACTIVE_ACCOUNTS,
  SET_NOTACTIVE_ACCOUNTS,
} from "../types";

export const set_loader = () => (dispatch) => {
  dispatch({ type: SET_AUTH_LOADER, payload: true });
};

export const cleear_loader = () => (dispatch) => {
  dispatch({ type: SET_AUTH_LOADER, payload: false });
};

export const show_error = () => async (dispatch) => {
  Alert.warning("<p>Proble whie fetching uri</p>", {
    position: "top-right",
    effect: "slide",
    beep: false,
    html: true,
    timeout: 5000,
    // offset: 100
  });
};

export const requestauthorizeUrl = (query) => async (dispatch) => {
  try {
    dispatch(set_loader());
    let { data } = await axios.get(`${url}/api/connect/authorise?id=${query}`);
    if (data.uri) {
      dispatch(cleear_loader());
      window.location.href = data.uri;
    }
  } catch (err) {
    dispatch(cleear_loader());
    dispatch(show_error());
  }
};

export const sendauthorizeCode = (formData) => async (dispatch) => {
  try {
    dispatch(set_loader());
    let { data } = await axios.post(
      `${url}/public/connect/authorise?id=${formData.provider}`,
      formData
    );
    if (data) {
      dispatch(cleear_loader());
      let url =
        process.env.NODE_ENV === "development"
          ? `http://localhost:3000/mailbox`
          : `https://${formData.workspaceId}.dominate.ai/mailbox`;
      window.location.href = url;
    }
  } catch (err) {
    dispatch(cleear_loader());
    dispatch(show_error());
  }
};

export const getConnectAccounts = () => async (dispatch) => {
  try {
    dispatch(set_loader());
    let { data } = await axios.get(`${url}/api/connect/accounts`);
    let active_accounts = data.filter((data) => data.status === "ACTIVE");
    let inactive_accounts = data.filter((data) => data.status === "NOTACTIVE");
    dispatch({
      type: SET_ACTIVE_ACCOUNTS,
      payload: active_accounts,
    });
    dispatch({
      type: SET_NOTACTIVE_ACCOUNTS,
      payload: inactive_accounts,
    });
    dispatch(cleear_loader());
  } catch (err) {
    dispatch(cleear_loader());
    dispatch(show_error());
  }
};

export const updateSingleAccounts = (id, formData) => async (dispatch) => {
  try {
    let { data } = await axios.put(
      `${url}/api/connect/account/${id}`,
      formData
    );
    dispatch(cleear_loader());
    dispatch(getConnectAccounts());
  } catch (err) {
    dispatch(cleear_loader());
    dispatch(show_error());
  }
};
