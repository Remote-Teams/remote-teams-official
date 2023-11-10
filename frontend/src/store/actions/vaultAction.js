import axios from "axios";
import { url, workspaceId } from "./config";
import {} from "./../types";
import setAuthToken from "./../utils/setAuthToken";
import Toast from "light-toast";
import {
  SET_ALL_FOLDERS,
  SET_FILES_OF_FOLDER,
  SET_VAULT_OVERVIEW,
  SET_LOADER,
  CLEAR_LOADER,
} from "./../types";

/*====================================================================
                        Create Folder Action
======================================================================*/

export const createFolder = (formData, type) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data } = await axios.post(`${url}/api/folders`, formData, {
      headers: headers,
    });
    if (data) {
      let projectData = JSON.parse(localStorage.getItem("projectData"));
      Toast.info("Folder Created", 3000);
      if (type === "project") {
        const formData = {
          query: {
            folderType: "PROJECT",
            project: projectData._id,
          },
        };
        dispatch(getAllFolder(formData));
      } else {
        const formData = {
          query: {
            folderType: "REGULAR",
          },
        };
        dispatch(getAllFolder(formData));
        dispatch(getVaultOverview());
      }
      dispatch({
        type: CLEAR_LOADER,
        payload: true,
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

/*====================================================================
                    Get All Folders
======================================================================*/

export const getAllFolder = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/folders/search`, formData, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_ALL_FOLDERS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                        Create File  Inside folder
======================================================================*/

/*======================================
    Vault file Upload inside folder
=======================================*/
export const uploadFileInsideFolder = (formData, folderId, fileSize) => (
  dispatch
) => {
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  axios
    .post(`https://login.remote-teams.io/api/upload`, formData)
    .then((res) => {
      const formData = {
        name: "sdtfrevd",
        file: res.data,
        folderId: folderId,
        category: "FOLDER",
        size: parseInt(fileSize),
      };

      dispatch(createFileInsideFolder(formData));
    })
    .catch((err) =>
      dispatch({
        type: CLEAR_LOADER,
        payload: false,
      })
    );
};

export const createFileInsideFolder = (formData) => async (dispatch) => {
  try {
    let { data } = await axios.post(`${url}/api/files`, formData);
    if (data) {
      console.log(data);
      const formDataCreateFile = {
        // "pageNo":1,
        // "pageSize":10,
        query: {
          folderId: formData.folderId,
        },
      };
      dispatch(getFilesByFolderId(formDataCreateFile));
      dispatch({
        type: CLEAR_LOADER,
        payload: true,
      });
      // const formData = { name: folderName };
      // dispatch(getFilesByFolderId(formData));
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                    Get Files Of Folder
======================================================================*/

export const getFilesByFolderId = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/files/search`, formData, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_FILES_OF_FOLDER,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const deleteFileById = (fileId, folderId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data } = await axios.delete(`${url}/api/files/${fileId}`, {
      headers: headers,
    });
    if (data) {
      console.log(data);
      Toast.info("File Deleted", 3000);
      const formData = {
        // "pageNo":1,
        // "pageSize":10,
        query: {
          folderId: folderId,
        },
      };
      dispatch(getFilesByFolderId(formData));
      dispatch({
        type: CLEAR_LOADER,
        payload: true,
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

export const deleteFolderById = (folderId, type) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data } = await axios.delete(`${url}/api/folders/${folderId}`, {
      headers: headers,
    });
    if (data) {
      Toast.info("Folder Deleted", 3000);
      let projectData = JSON.parse(localStorage.getItem("projectData"));

      if (type === "project") {
        const formData = {
          query: {
            folderType: "PROJECT",
            project: projectData._id,
          },
        };
        dispatch(getAllFolder(formData));
      } else {
        const formData = {
          query: {
            folderType: "REGULAR",
          },
        };
        dispatch(getAllFolder(formData));
        dispatch(getVaultOverview());
      }
      dispatch({
        type: CLEAR_LOADER,
        payload: true,
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

/*====================================================================
                   GET VAULT OVERVIEW
======================================================================*/

export const getVaultOverview = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/folders/vaultOverview`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_VAULT_OVERVIEW,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
