import React, { Component } from "react";
// import AddKanBanBoard from "./../../desktop/all-project-planning/AddKanBanBoard";
import isEmpty from "../../../store/validations/is-empty";
import { connect } from "react-redux";
import store from "../../../store/store";
import { SET_KANBAN_VIEW } from "./../../../store/types";
import // getStackOfPerticularBoard,
// deleteBoardById,
"./../../../store/actions/kanbanAction";
// import EditKanBanBoard from "./EditKanBanBoard";
import DropdownIcon from "rc-dropdown";
import "rc-dropdown/assets/index.css";
import Menu, { Item as MenuItem, Divider } from "rc-menu";

export class KanBanMain extends Component {
  constructor() {
    super();
    this.state = {
      allKanbanBoards: [],
    };
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allKanbanBoards) &&
      nextProps.allKanbanBoards !== nextState.allKanbanBoards
    ) {
      return {
        allKanbanBoards: nextProps.allKanbanBoards,
      };
    }
    return null;
  }

  onClickBoard = (boardData) => (e) => {
    // const formData = {
    //   pageNo: 1,
    //   pageSize: 10,
    //   query: {
    //     kanban: boardData._id,
    //   },
    // };
    // this.props.getStackOfPerticularBoard(formData);
    // console.log(boardData);
    store.dispatch({
      type: SET_KANBAN_VIEW,
      payload: true,
    });
    localStorage.setItem("boardData", JSON.stringify(boardData));
  };

  onSelect = (action, boardData) => {
    if (action === "edit") {
      console.log("edit", boardData);
    } else {
      console.log("delete", boardData);
      // this.props.deleteBoardById(boardData._id);
    }
  };

  renderBoardEditDropdown = (boardData) => {
    // const { admin } = this.state;
    const { userRole } = this.props;
    const menu = (
      <Menu>
        <MenuItem onClick={() => this.onSelect("edit", boardData)}>
          {/* <EditKanBanBoard boardData={boardData} /> */}
        </MenuItem>
        <Divider />

        <MenuItem onClick={() => this.onSelect("delete", boardData)}>
          Delete Board
        </MenuItem>
      </Menu>
    );

    return (
      <DropdownIcon
        trigger={["click"]}
        overlay={menu}
        animation="none"
        onVisibleChange={this.onVisibleChange}
      >
        <i className="fa fa-ellipsis-v" />
      </DropdownIcon>
    );
  };

  render() {
    const { singleProjectData } = this.props;
    const { allKanbanBoards } = this.state;
    // console.log(this.state.allKanbanBoards);
    return (
      <div className="kanban_main_container">
        {!isEmpty(allKanbanBoards) &&
          allKanbanBoards.map((board, index) => {
            return (
              <div key={index}>
                <div
                  onClick={this.onClickBoard(board)}
                  className="kanban_board"
                >
                  <img
                    className="board_img"
                    src={require("./../../../assets/img/kanban/board_image.svg")}
                    alt=""
                  />
                </div>
                <div className="board_bottom_section">
                  <h4>{board.name}</h4>
                  {this.renderBoardEditDropdown(board)}
                </div>
              </div>
            );
          })}

        {/* <AddKanBanBoard
          singleProjectData={!isEmpty(singleProjectData) && singleProjectData}
        /> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  allKanbanBoards: state.kanban.allKanbanBoards,
});

export default connect(mapStateToProps, {
  // getStackOfPerticularBoard,
  // deleteBoardById,
})(KanBanMain);
