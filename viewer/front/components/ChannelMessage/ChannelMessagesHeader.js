import React from "react";
import { useSelector } from "react-redux";
import ChannelItem from "../ChannelItem/ChannelItem";

const ChannelMessagesHeader = ({ currentChannelId }) => {
  const channels = useSelector((state) => state.channels.channels);
  const ims = useSelector((state) => state.ims);
  if (!currentChannelId || currentChannelId == "all") {
    // TODO 0とかでも条件を満たしてしまう typeof undefined で比較?
    return (
      <div className="messages-header">
        <div className="title">
          <span className={"channel-name channel"}>ALL</span>
        </div>
      </div>
    );
  }
  const allChannels = Object.assign({}, channels, ims);
  const channel = allChannels[currentChannelId];
  if (!channel) {
    return null;
  }

  return (
    <div className="messages-header">
      <div className="title">
        <ChannelItem channel={channel} />
      </div>
    </div>
  );
};
export default ChannelMessagesHeader;

// const mapStateToProps = (state) => {
//   return {
//     channels: state.channels.channels,
//     ims: state.channels.ims,
//     router: state.router,
//   };
// };

//  connect(mapStateToProps)(ChannelMessagesHeader);
