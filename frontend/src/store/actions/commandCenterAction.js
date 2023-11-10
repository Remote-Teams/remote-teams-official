import axios from "axios";
import { url, workspaceId } from "./config";
// import setAuthToken from "./../utils/setAuthToken";
import Toast from "light-toast";
import {
  SET_ALL_CUSTOM_FIELDS,
  SET_ALL_USERS_ROLES,
  SET_CLIENT_ALL_CUSTOME_FIELDS,
  SET_MEMBER_ALL_CUSTOME_FIELDS,
  SET_PROJECT_ALL_CUSTOME_FIELDS,
  GET_FIELDS_VALUE_BY_ENTITY,
  SET_LOADER,
  CLEAR_LOADER,
} from "./../types";

/*===========================================================================================
                                  Roles and Permissions
=============================================================================================*/

/*===============================
          Get All Roles
===============================*/

export const getAllRoles = () => async (dispatch) => {
  try {
    let { data } = await axios.get(`${url}/api/roles`);
    if (data) {
      dispatch({
        type: SET_ALL_USERS_ROLES,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===============================
          Create Roles
  ===============================*/

export const createRoles = (formData, callBackAddRole) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data, status } = await axios.post(`${url}/api/roles`, formData, {
      headers: headers,
    });
    if (data) {
      Toast.info("New role created", 3000);
      dispatch(getAllRoles());
      callBackAddRole(status);
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

/*===============================
        Delete Role By id
  ===============================*/

export const deleteRoleById = (roleId) => async (dispatch) => {
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data } = await axios.delete(`${url}/api/roles/${roleId}`);
    if (data) {
      Toast.info("Role  deleted", 3000);
      dispatch(getAllRoles());
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

/*===============================
        Update Role By id
  ===============================*/

export const updateRoleById = (roleId, formData, callBackUpdate) => async (
  dispatch
) => {
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data, status } = await axios.put(
      `${url}/api/roles/${roleId}`,
      formData
    );
    if (data) {
      console.log(data);
      Toast.info("Role Updated", 3000);

      dispatch(getAllRoles());
      callBackUpdate(status);
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

/*===========================================================================================
                                    Custom Fields command center
  =============================================================================================*/

/*===============================
        Create Custom IsExist
  ===============================*/

export const customFieldIsExist = (
  fieldName,
  entity,
  formData,
  callBackCustomFields
) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/fields/exist?name=${fieldName}&entity=${entity}`,
      {
        headers: headers,
      }
    );
    if (data) {
      if (data.isExist) {
        Toast.info("Custom field already exist", 3000);
      } else {
        dispatch(createCustomField(formData, callBackCustomFields));
      }
    }
  } catch (err) {
    console.log(err);
  }
};

/*===============================
        Create Custom Field
  ===============================*/

export const createCustomField = (formData, callBackCustomFields) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data, status } = await axios.post(`${url}/api/fields`, formData, {
      headers: headers,
    });
    if (data) {
      Toast.info("Custom field created", 3000);

      callBackCustomFields(status);
      dispatch(getAllCustomFields());
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

/*===============================
        Get All Custom Fields
  ===============================*/

export const getAllCustomFields = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/fields?pageNo=1&pageSize=10`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_ALL_CUSTOM_FIELDS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===============================
        Get All Custom Fields
  ===============================*/

export const UpdateCustomFields = (formData, callBackUpdateField) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data, status } = await axios.put(
      `${url}/api/fields/${formData._id}`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      Toast.info("Custom field updated", 3000);

      dispatch(getAllCustomFields());
      callBackUpdateField(status);
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

/*===============================
        Delete Custom Field
  ===============================*/

export const deleteCustomField = (customFieldId, callBackDelete) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data, status } = await axios.delete(
      `${url}/api/fields/${customFieldId}`,
      {
        headers: headers,
      }
    );
    if (data) {
      Toast.info("Custom field deleted", 3000);

      dispatch(getAllCustomFields());
      callBackDelete();
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

/*=====================================
        Get All Custom Fields By Entity
  =======================================*/

export const getAllCustomFieldsByEntity = (entityName) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };

  const formData = {
    entity: entityName,
  };
  try {
    let { data, status } = await axios.post(
      `${url}/api/fields/search`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      if (entityName === "CLIENT") {
        dispatch({
          type: SET_CLIENT_ALL_CUSTOME_FIELDS,
          payload: data,
        });
      } else if (entityName === "MEMBER") {
        dispatch({
          type: SET_MEMBER_ALL_CUSTOME_FIELDS,
          payload: data,
        });
      } else if (entityName === "PROJECT") {
        dispatch({
          type: SET_PROJECT_ALL_CUSTOME_FIELDS,
          payload: data,
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

/*===============================
        Create Field Value 
  ===============================*/

export const createFieldValue = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data } = await axios.post(`${url}/api/fvalues`, formData, {
      headers: headers,
    });
    if (data) {
      console.log(data);
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

/*===============================
    Update Field Value by id 
  ===============================*/

export const updateFieldValueById = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data } = await axios.put(
      `${url}/api/fvalues/${formData._id}`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      console.log(data);
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

/*=====================================
        Get All Fields value By query
  =======================================*/

export const getAllFieldsValue = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/fvalues/search`, formData, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: GET_FIELDS_VALUE_BY_ENTITY,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
