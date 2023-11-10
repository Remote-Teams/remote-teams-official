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

const setpDueInDropdownOptions = [
  { value: "HRS", label: "HRS" },
  { value: "MINS", label: "MINS" },
];

const initialState = {
  addContent: {},
  allStepsData: [
    {
      isSaved: false,
      stepName: "step name",
      dueInCount: 2,
      selectedOption: setpDueInDropdownOptions[0],
      description: "",
      addContentTextInputField: [],
      addContentNumberInputField: [],
      addContentDateInputField: [],
      addContentSingleQuestion: [],
      addContentMultipleQuestion: [],
      addContentSubtasks: [],
      addContentAttachments: [],
      addContentConditions: [],
    },
  ],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_ALL_STEPS_DATA:
      return {
        ...state,
        allStepsData: action.payload,
      };

    case SET_ADD_CONTENT_BLOCK:
      return {
        ...state,
        addContent: action.payload,
      };

    case SET_ADD_CONTENT_TEXT_INPUT_FIELD:
      return {
        ...state,
        allStepsData: [...state.allStepsData],
        // addContentTextInputField: action.payload,
      };

    case SET_ADD_CONTENT_NUMBER_INPUT_FIELD:
      return {
        ...state,
        allStepsData: [...state.allStepsData],
        // addContentNumberInputField: action.payload,
      };

    case SET_ADD_CONTENT_DATE_INPUT_FIELD:
      return {
        ...state,
        allStepsData: [...state.allStepsData],
        // addContentDateInputField: action.payload,
      };

    case SET_ADD_CONTENT_SINGLE_QUESTION:
      return {
        ...state,
        allStepsData: [...state.allStepsData],
        // addContentSingleQuestion: action.payload,
      };

    case SET_ADD_CONTENT_MULTIPLE_QUESTION:
      return {
        ...state,
        allStepsData: [...state.allStepsData],
        // addContentMultipleQuestion: action.payload,
      };

    case SET_ADD_CONTENT_SUBTASKS:
      return {
        ...state,
        allStepsData: [...state.allStepsData],
        // addContentSubtasks: action.payload,
      };

    case SET_ADD_CONTENT_ATTACHMENTS:
      return {
        ...state,
        allStepsData: [...state.allStepsData],
        // addContentAttachments: action.payload,
      };

    case SET_ADD_CONTENT_CONDITIONS:
      return {
        ...state,
        allStepsData: [...state.allStepsData],
        // addContentConditions: action.payload,
      };

    default:
      return state;
  }
}
