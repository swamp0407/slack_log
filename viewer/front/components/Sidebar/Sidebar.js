import React from "react";
import SidebarHeader from "./SidebarHeader";
import SlackChannels from "./SlackChannels";

const Sidebar = ({ sidebarStyle }) => {
  return (
    <div className="sidebar" style={sidebarStyle}>
      <SidebarHeader />
      <SlackChannels />
    </div>
  );
};

export default Sidebar;
