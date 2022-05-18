import Sidebar from "../../components/Sidebar/Sidebar";
import React from "react";
import { connect, useSelector } from "react-redux";
import "./SidebarContainer.less";

const SidebarContainer = () => {
  const dx = useSelector((state) => state.resize.dx);
  const width = 260 + dx;
  let sidebarStyle = {
    width: width,
  };
  return <Sidebar sidebarStyle={sidebarStyle} />;
};

export default SidebarContainer;
