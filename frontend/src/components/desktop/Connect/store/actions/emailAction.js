import axios from "axios";
import Alert from "react-s-alert";
import { url } from "../../../../../store/actions/config";
import { SET_EMAIL_LOADER, GET_ALL_DRAFTS, GET_EMAIL_THREADS } from "../types";

export const set_loader = () => (dispatch) => {
  dispatch({ type: SET_EMAIL_LOADER, payload: true });
};

export const cleear_loader = () => (dispatch) => {
  dispatch({ type: SET_EMAIL_LOADER, payload: false });
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

/*****************************
 * @DESC - DRAFT RELATED QUERY
 ****************************/
export const get_all_drafts = (params) => async (dispatch) => {
  try {
    dispatch(set_loader());
    let { data } = await axios.get(`${url}/api/connect/drafts?${params}`);
    if (data) {
      dispatch({
        type: GET_ALL_DRAFTS,
        payload: data,
      });
      dispatch(cleear_loader());
    }
  } catch (err) {
    dispatch(cleear_loader());
    dispatch(show_error());
  }
};

export const create_new_draft = (formData, params) => async (dispatch) => {
  try {
    dispatch(set_loader());
    let { data } = await axios.post(`${url}/api/connect/drafts`, formData);
    if (data) {
      dispatch(get_all_drafts(params));
      dispatch(cleear_loader());
    }
  } catch (err) {
    dispatch(cleear_loader());
    dispatch(show_error());
  }
};

export const update_draft = (formData, params, options) => async (dispatch) => {
  try {
    dispatch(set_loader());
    let { data } = await axios.put(
      `${url}/api/connect/drafts?${options}`,
      formData
    );
    if (data) {
      dispatch(get_all_drafts(params));
      dispatch(cleear_loader());
    }
  } catch (err) {
    dispatch(cleear_loader());
    dispatch(show_error());
  }
};

export const delete_draft = (params, options) => async (dispatch) => {
  try {
    dispatch(set_loader());
    let { data } = await axios.delete(`${url}/api/connect/drafts?${params}`);
    if (data) {
      dispatch(get_all_drafts(options));
      dispatch(cleear_loader());
    }
  } catch (err) {
    dispatch(cleear_loader());
    dispatch(show_error());
  }
};

/*****************************
 * @DESC - THREADS RELATED QUERY
 ****************************/
export const get_email_threads = (params) => async (dispatch) => {
  try {
    dispatch(set_loader());
    dispatch({
      type: GET_EMAIL_THREADS,
      payload: {},
    });
    let { data } = await axios.get(`${url}/api/connect/threads?${params}`);
    if (data) {
      dispatch({
        type: GET_EMAIL_THREADS,
        payload: data,
      });
      dispatch(cleear_loader());
    }
  } catch (err) {
    dispatch(cleear_loader());
    dispatch(show_error());
  }
};

export const send_new_email = (formData, params, options) => async (
  dispatch
) => {
  try {
    dispatch(set_loader());
    let { data } = await axios.post(
      `${url}/api/connect/threads?${options}`,
      formData
    );
    if (data) {
      dispatch(get_email_threads(params));
      dispatch(cleear_loader());
    }
  } catch (err) {
    dispatch(cleear_loader());
    dispatch(show_error());
  }
};

export const update_emails = (formData, params, options) => async (
  dispatch
) => {
  try {
    dispatch(set_loader());
    let { data } = await axios.put(
      `${url}/api/connect/threads?${params}`,
      formData
    );
    if (data) {
      dispatch(get_email_threads(options));
      window.location.reload();
      dispatch(cleear_loader());
    }
  } catch (err) {
    dispatch(cleear_loader());
    dispatch(show_error());
  }
};

export const delete_threads = (params, options) => async (dispatch) => {
  try {
    dispatch(set_loader());
    let { data } = await axios.delete(`${url}/api/connect/threads?${params}`);
    if (data) {
      dispatch(get_email_threads(options));
      dispatch(cleear_loader());
    }
  } catch (err) {
    dispatch(cleear_loader());
    dispatch(show_error());
  }
};
