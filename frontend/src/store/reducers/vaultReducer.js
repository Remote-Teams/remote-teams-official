import {
  SET_ALL_FOLDERS,
  SET_FILES_OF_FOLDER,
  SET_VAULT_OVERVIEW,
} from "./../types";

const initialState = {
  allFolders: {},
  vaultOverview: {},
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_ALL_FOLDERS:
      return {
        ...state,
        allFolders: action.payload,
      };
    case SET_FILES_OF_FOLDER:
      return {
        ...state,
        allFilesOfFolder: action.payload,
      };
    case SET_VAULT_OVERVIEW:
      return {
        ...state,
        vaultOverview: action.payload,
      };
    default:
      return state;
  }
}
