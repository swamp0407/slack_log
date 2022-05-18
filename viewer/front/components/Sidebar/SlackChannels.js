import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import ChannelItem from "../ChannelItem/ChannelItem";
import config from "../../config";

// class Sidebar extends React.Component {

const SlackChannels = () => {
  const channels = useSelector((state) => state.channels.channels);
  const ims = useSelector((state) => state.channels.ims);
  const dx = useSelector((state) => state.resize.dx);
  const createChannelList = (channels) => {
    const key_func = (a, b) => {
      if (a.name > b.name) {
        return 1;
      } else {
        return -1;
      }
    };
    let sortedchannels = Object.values(channels).sort(key_func);
    return sortedchannels.map((channel) => (
      <li key={channel.id}>
        <NavLink to={`${config.subdir}/${channel.id}`}>
          <ChannelItem channel={channel} />
        </NavLink>
      </li>
    ));
  };
  // let dx = this.props.dx;
  const width = 260 - 12 + dx;
  return (
    <div className="sidebar-body">
      <div
        className="slack-channels"
        style={{
          width: width,
        }}
      >
        <h3>CHANNELS({Object.keys(channels).length})</h3>
        <ul className="list">{createChannelList(channels)}</ul>
      </div>
      <div className="slack-ims">
        <h3>DIRECT MESSAGES({Object.keys(ims).length})</h3>
        <ul className="list">{createChannelList(ims)}</ul>
      </div>
    </div>
  );
};

export default SlackChannels;
