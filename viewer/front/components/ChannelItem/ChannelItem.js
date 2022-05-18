import React from "react";

import "./ChannelItem.less";

const channelTypeToClassName = {
  C: "channel",
  G: "group",
  D: "im",
};

export default (props) => {
  const channel = props.channel;
  const channelType = channel.id[0];
  const classNames = ["channel-name", channelTypeToClassName[channelType]];
  return <span className={classNames.join(" ")}>{channel.name}</span>;
};
