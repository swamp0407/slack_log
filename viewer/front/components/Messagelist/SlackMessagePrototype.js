import React from "react";
import { useSelector } from "react-redux";
import config from "../../config";
import { Link } from "react-router-dom";
import ChannelItem from "../ChannelItem/ChannelItem";
import SlackFilesLink from "./SlackFilesLink";
const SlackMessagePrototype = ({
  message,
  icon,
  username,
  showChannel,
  teamInfo,
  channel,
  text,
  messageRef,
  selected,
}) => {
  const classNames = ["slack-message"];
  const users = useSelector((state) => state.users);
  const channels = useSelector((state) => state.channels);
  if (selected) {
    classNames.push("selected");
  }
  const formatText = (text) => {
    const entity = (str) => {
      return str
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    };
    const channelLink = (id) => {
      const channel = channels[id];
      return `#${channel && channel.name}`;
    };
    const createChannnelLink = (channel, string) =>
      `<a href=${config.subdir}/${channel} name=${channel} >${string}</a>`;

    const channelUrlLink = (id, string) => {
      return createChannnelLink(id, string);
    };
    const userLink = (id) => {
      const user = users[id];
      return `@${
        user && user.profile
          ? user.profile.display_name != ""
            ? user.profile.display_name
            : user.profile.real_name
          : "名無し"
      }`;
    };
    const specialCommand = (command) => `@${command}`;
    const uriLink = (uri) => `<a href="${uri}" target="_blank">${uri}</a>`;
    if (text) {
      return text
        .replace(/<#([0-9A-Za-z]+)>/, (m, id) => channelLink(id))
        .replace(/<#([0-9A-Za-z]+)\|(.+?)>/gi, (m, channelname, string) =>
          channelUrlLink(channelname, string)
        )
        .replace(/<@([0-9A-Za-z]+)>/gi, (m, id) => userLink(id))
        .replace(/<@([0-9A-Za-z]+)\|([0-9A-Za-z]+)>/gi, (m, id) => userLink(id))
        .replace(/<!(channel|everyone|group)>/gi, (m, command) =>
          specialCommand(command)
        )
        .replace(/(https?:\/\/.*)\|\1/gi, (m, uri) => uri)
        .replace(/<([a-z0-9]+:\/\/[^>]*)>/gi, (m, uri) => uriLink(entity(uri)));
    }

    return text;
  };
  const messageLink = (message) => {
    return `${config.subdir}/${message.channel}/${message.ts}`;
  };
  const formatDate = (date) => {
    return new Date(date * 1000).toLocaleString();
  };
  const originalMessageLink = (teamInfo, message) => {
    const messageId = message.ts.replace(".", "");
    return `https://${teamInfo.domain}.slack.com/messages/${message.channel}/p${messageId}`;
  };
  const createMarkup = (text) => {
    return {
      __html: formatText(text) || "",
    };
  };

  return (
    <div className={classNames.join(" ")} ref={messageRef}>
      <div className="slack-message-user-image">
        <img src={icon} />
      </div>
      <div className="slack-message-content">
        <div className="slack-message-user-name">{username}</div>
        <div className="slack-message-date">
          <Link to={messageLink(message)}>{formatDate(message.ts)}</Link>
        </div>
        {showChannel && channel ? (
          <div className="slack-message-channel">
            <Link to={`${config.subdir}/${channel.id}`}>
              <ChannelItem channel={channel} />
            </Link>
          </div>
        ) : null}
        <div className="slack-original-message-link">
          <a href={originalMessageLink(teamInfo, message)} target="_blank">
            open original
          </a>
        </div>
        <div
          className="slack-message-text"
          dangerouslySetInnerHTML={createMarkup(text)}
        ></div>
        {message.upload_files ? (
          <SlackFilesLink file_links={message.upload_files} />
        ) : null}
      </div>
    </div>
  );
};

export default SlackMessagePrototype;
