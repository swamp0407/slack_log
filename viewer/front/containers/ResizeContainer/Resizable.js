import React from "react";

import "./Resizable.less";

const Resizable = (props) => {
  return <div className="resizable" onMouseDown={props.onMouseDown}></div>;
};

export default Resizable;
