import React, { Component } from "react";
import { SeeThrough } from "react-see-through";

export class SeeThroughDemo extends Component {
  render() {
    return (
      <div>
        <SeeThrough
          maskColor="rgba(26, 32, 35, 0.78)"
          active={true}
          // onClick={masked => masked && setActive(false)}
        >
          <div style={{ marginTop: "400px", marginLeft: "200px" }}>
            <div>Some text</div>
            <div>Other text</div>
          </div>
        </SeeThrough>
      </div>
    );
  }
}

export default SeeThroughDemo;
