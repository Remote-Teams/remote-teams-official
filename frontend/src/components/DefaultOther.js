import React, { Component } from "react";
import CanvasDraw from "react-canvas-draw";
import { SeeThrough } from "react-see-through";

class DefaultOther extends Component {
  constructor() {
    super();
    this.state = {
      active: false,
      editableDrwaing: false,
      catenaryColor: "#ffffff",
      color: "#5ccc40",
      backgroundColor: "rgba(105, 105, 108, 0.16)",
      brushRadius: 2,
      lazyRadius: 2,
      width: 600,
      height: 400,
      setDrawing: "",
      gridColor: "rgba(105, 105, 108, 0.16)",
    };
  }

  onSaveDrawingClick = () => {
    console.log("savedDrawing", JSON.parse(this.saveableCanvas.getSaveData()));
    localStorage.setItem("savedDrawing", this.saveableCanvas.getSaveData());
    this.setState({
      setDrawing: this.saveableCanvas.getSaveData(),
      editableDrwaing: false,
    });
  };

  onClearDrawing = () => {
    this.saveableCanvas.clear();
  };

  onClickUndoDrawing = () => {
    this.saveableCanvas.undo();
  };

  startEditingDrawing = () => {
    this.setState({
      editableDrwaing: true,
    });
  };

  render() {
    console.log(this.state.editableDrwaing);

    return (
      <>
        <div style={{ padding: "60px" }}>
          {/* <button onClick={() => setActive(true)}>Activate</button> */}
          <SeeThrough
            className={"sdsd"}
            onClick={console.log("dsadas")}
            interactive
            active={this.state.active}
          >
            <div>Some text</div>
            <div>Other text</div>
            {/* {active && <button onClick={() => setActive(false)}>Close</button>} */}
          </SeeThrough>
        </div>

        {/* drawingboard.js */}

        {/* <div id="div"></div>
        <button id="button">Take image</button> */}

        {/* white board  */}

        <div style={{ display: "flex" }}>
          <div>
            <button onClick={this.onSaveDrawingClick}>Save</button>
            <button onClick={this.onClearDrawing}>Clear</button>
            <button onClick={this.onClickUndoDrawing}>Undo</button>
            <button onClick={this.startEditingDrawing}>Edit</button>
            <div>
              <label>Width:</label>
              <input
                type="number"
                value={this.state.width}
                onChange={(e) =>
                  this.setState({ width: parseInt(e.target.value, 10) })
                }
              />
            </div>
            <div>
              <label>Height:</label>
              <input
                type="number"
                value={this.state.height}
                onChange={(e) =>
                  this.setState({ height: parseInt(e.target.value, 10) })
                }
              />
            </div>
            <div>
              <label>Brush-Radius:</label>
              <input
                type="number"
                value={this.state.brushRadius}
                onChange={(e) =>
                  this.setState({ brushRadius: parseInt(e.target.value, 10) })
                }
              />
            </div>
            <div>
              <label>Lazy-Radius:</label>
              <input
                type="number"
                value={this.state.lazyRadius}
                onChange={(e) =>
                  this.setState({ lazyRadius: parseInt(e.target.value, 10) })
                }
              />
            </div>
            {this.state.editableDrwaing === true ? (
              <CanvasDraw
                ref={(canvasDraw) => (this.saveableCanvas = canvasDraw)}
                backgroundColor={this.state.backgroundColor}
                brushColor={this.state.color}
                brushRadius={this.state.brushRadius}
                lazyRadius={this.state.lazyRadius}
                canvasWidth={this.state.width}
                canvasHeight={this.state.height}
                catenaryColor={this.state.catenaryColor}
                saveData={localStorage.getItem("savedDrawing")}
                gridColor={this.state.gridColor}
              />
            ) : (
              <CanvasDraw
                ref={(canvasDraw) => (this.saveableCanvas = canvasDraw)}
                backgroundColor={this.state.backgroundColor}
                brushColor={this.state.color}
                brushRadius={this.state.brushRadius}
                lazyRadius={this.state.lazyRadius}
                canvasWidth={this.state.width}
                canvasHeight={this.state.height}
                catenaryColor={this.state.catenaryColor}
                saveData={localStorage.getItem("savedDrawing")}
                gridColor={this.state.gridColor}
                disabled
              />
            )}
          </div>
          {/* <div>
            <CanvasDraw
              disabled
              hideGrid
              ref={(canvasDraw) => (this.loadableCanvas = canvasDraw)}
              saveData={this.state.setDrawing}
            />
          </div> */}
        </div>
      </>
    );
  }
}

export default DefaultOther;
