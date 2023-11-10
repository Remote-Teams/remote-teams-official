import axios from "axios";
import { url, workspaceId } from "./config";
// import setAuthToken from "./../utils/setAuthToken";
// import Toast from "light-toast";
import {
  SET_ALL_NOTES,
  SET_ERRORS,
  SET_LOADER,
  CLEAR_LOADER,
} from "./../types";

/*====================================================
                  Add New Note
======================================================*/

export const addNewNote = (formData, history) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/notes`, formData, {
      headers: headers,
    });
    if (data) {
      history.push("/notes");
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================
            Check Note Name Exists or Not
======================================================*/

export const getNoteName = (noteName, callback) => async (dispatch) => {
  try {
    let { data } = await axios.get(`${url}/api/notes/exist?name=${noteName}`);
    if (data) {
      callback(data);
      dispatch({
        type: SET_ERRORS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================
                  Get All Note
======================================================*/

export const getAllNotes = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data } = await axios.get(`${url}/api/notes`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_ALL_NOTES,
        payload: data,
      });
      dispatch({
        type: CLEAR_LOADER,
        payload: false,
      });
    }
  } catch (err) {
    console.log(err);
    dispatch({
      type: CLEAR_LOADER,
      payload: false,
    });
  }
};

/*=====================================================
              Update Note By Id
=======================================================*/
export const updateNote = (noteId, formData, history) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.put(`${url}/api/notes/${noteId}`, formData, {
      headers: headers,
    });
    if (data) {
      dispatch(getAllNotes());
      history.push("/notes");
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                    Delete Note
=====================================================================*/
export const deleteNote = (noteId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.delete(`${url}/api/notes/${noteId}`, {
      headers: headers,
    });
    if (data) {
      console.log(data);
      dispatch(getAllNotes());
    }
  } catch (err) {
    console.log(err);
  }
};
