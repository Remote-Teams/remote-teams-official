import {
  SET_ADD_CONTENT_BLOCK,
  SET_ADD_CONTENT_TEXT_INPUT_FIELD,
  SET_ADD_CONTENT_NUMBER_INPUT_FIELD,
  SET_ADD_CONTENT_DATE_INPUT_FIELD,
  SET_ADD_CONTENT_SINGLE_QUESTION,
  SET_ADD_CONTENT_MULTIPLE_QUESTION,
  SET_ADD_CONTENT_SUBTASKS,
  SET_ADD_CONTENT_ATTACHMENTS,
  SET_ADD_CONTENT_CONDITIONS,
  SET_ALL_STEPS_DATA,
} from "./../types";

/*====================================================================
            close add content block payload
======================================================================*/
export const stepsContentIconButtonOptions = [
  "inputField",
  "question",
  "condition",
  "subtask",
  "attachment",
];

export const closeAddContentBlockPayload = {
  isDisplayAddContentBlock: false,
  displayAddContentIconButtonClicked: "",
};

export const goBackAddInputFieldPayload = {
  addInputFieldSelectButtonClicked: "",
  isDisplayAddContentBlock: true,
  displayAddContentIconButtonClicked: stepsContentIconButtonOptions[0],
};

export const goBackQuestionFieldPayload = {
  addQuestionSelectButtonClicked: "",
  isDisplayAddContentBlock: true,
  displayAddContentIconButtonClicked: stepsContentIconButtonOptions[1],
};

/*====================================================================
            set all steps data
======================================================================*/

export const setAllStepsDataAction = (data) => async (dispatch) => {
  try {
    dispatch({
      type: SET_ALL_STEPS_DATA,
      payload: data,
    });
  } catch (error) {
    console.log(error);
  }
};

/*====================================================================
            set open add content block
======================================================================*/

export const setAddContentBlockAction = (data) => async (dispatch) => {
  try {
    dispatch({
      type: SET_ADD_CONTENT_BLOCK,
      payload: data,
    });
  } catch (error) {
    console.log(error);
  }
};

/*====================================================================
            set add content text input field
======================================================================*/

export const setAddContentTextInputFieldAction = (data) => async (dispatch) => {
  try {
    dispatch({
      type: SET_ADD_CONTENT_TEXT_INPUT_FIELD,
      payload: data,
    });
  } catch (error) {
    console.log(error);
  }
};

/*====================================================================
            set add content number input field
======================================================================*/

export const setAddContentNumberInputFieldAction = (data) => async (
  dispatch
) => {
  try {
    dispatch({
      type: SET_ADD_CONTENT_NUMBER_INPUT_FIELD,
      payload: data,
    });
  } catch (error) {
    console.log(error);
  }
};

/*====================================================================
            set add content date input field
======================================================================*/

export const setAddContentDateInputFieldAction = (data) => async (dispatch) => {
  try {
    dispatch({
      type: SET_ADD_CONTENT_DATE_INPUT_FIELD,
      payload: data,
    });
  } catch (error) {
    console.log(error);
  }
};

/*====================================================================
            set add content single question
======================================================================*/

export const setAddContentSingleQuestionAction = (data) => async (dispatch) => {
  try {
    dispatch({
      type: SET_ADD_CONTENT_SINGLE_QUESTION,
      payload: data,
    });
  } catch (error) {
    console.log(error);
  }
};

/*====================================================================
            set add content multiple question
======================================================================*/

export const setAddContentMultipleQuestionAction = (data) => async (
  dispatch
) => {
  try {
    dispatch({
      type: SET_ADD_CONTENT_MULTIPLE_QUESTION,
      payload: data,
    });
  } catch (error) {
    console.log(error);
  }
};

/*====================================================================
            set add content multiple question
======================================================================*/

export const setAddContentSubtasksAction = (data) => async (dispatch) => {
  try {
    dispatch({
      type: SET_ADD_CONTENT_SUBTASKS,
      payload: data,
    });
  } catch (error) {
    console.log(error);
  }
};

/*====================================================================
            set add content attachments
======================================================================*/

export const setAddContentAttachmentsAction = (data) => async (dispatch) => {
  try {
    dispatch({
      type: SET_ADD_CONTENT_ATTACHMENTS,
      payload: data,
    });
  } catch (error) {
    console.log(error);
  }
};

/*====================================================================
            set add content conditions
======================================================================*/

export const setAddContentConditionsAction = (data) => async (dispatch) => {
  try {
    dispatch({
      type: SET_ADD_CONTENT_CONDITIONS,
      payload: data,
    });
  } catch (error) {
    console.log(error);
  }
};

/*====================================================================
            reset all add content data
======================================================================*/

export const resetAllAddContentDataAction = () => async (dispatch) => {
  try {
    dispatch({
      type: SET_ADD_CONTENT_TEXT_INPUT_FIELD,
      payload: [],
    });
    dispatch({
      type: SET_ADD_CONTENT_NUMBER_INPUT_FIELD,
      payload: [],
    });
    dispatch({
      type: SET_ADD_CONTENT_DATE_INPUT_FIELD,
      payload: [],
    });
    dispatch({
      type: SET_ADD_CONTENT_SINGLE_QUESTION,
      payload: [],
    });
    dispatch({
      type: SET_ADD_CONTENT_MULTIPLE_QUESTION,
      payload: [],
    });
    dispatch({
      type: SET_ADD_CONTENT_SUBTASKS,
      payload: [],
    });
    dispatch({
      type: SET_ADD_CONTENT_ATTACHMENTS,
      payload: [],
    });
    dispatch({
      type: SET_ADD_CONTENT_CONDITIONS,
      payload: [],
    });
  } catch (error) {
    console.log(error);
  }
};
