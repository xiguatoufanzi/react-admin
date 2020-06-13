import React, { Component } from "react";
import Search from "./components/Search";
import List from "./components/List";

export default class Chapter extends Component {
  screenfullRef = React.createRef();

  render() {
    return (
      <div ref={this.screenfullRef} style={{ backgroundColor: "#f5f5f5" }}>
        <Search />
        <List screenfullRef={this.screenfullRef} />
      </div>
    );
  }
}
