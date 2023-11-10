import {
  SET_KANBAN_BOARDS,
  SET_KANBAN_VIEW,
  SET_STACKLIST_OF_BOARD,
} from "./../types";

const initialState = {
  allKanbanBoards: {},
  kanBanView: false,
  stackListOfBoard: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_KANBAN_BOARDS:
      return {
        ...state,
        allKanbanBoards: action.payload,
      };
    case SET_KANBAN_VIEW:
      return {
        ...state,
        kanBanView: action.payload,
      };
    case SET_STACKLIST_OF_BOARD:
      return {
        ...state,
        stackListOfBoard: action.payload,
      };

    default:
      return state;
  }
}
