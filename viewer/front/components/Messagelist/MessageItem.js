import React from "react";
import MessagesType from "../../constants/MessagesType";
import SlackMessagePrototype from "../Messagelist/SlackMessagePrototype";

const MessageItem = ({
  message,
  selected,
  type,
  channels,
  users,
  bots,
  ims,
  teamInfo,
  messageRef,
}) => {
  if (message.hidden) {
    return null;
  }
  const getChannel = (id) => {
    if (channels && channels[id]) {
      return channels[id];
    }
    if (ims && ims[id]) {
      return ims[id];
    }
  };
  const getUser = (id) => {
    return users && users[id];
  };
  const getBot = (id) => {
    return bots && bots[id];
  };
  const channel = getChannel(message.channel);
  const showChannel =
    type === MessagesType.SEARCH_MESSAGES || type === MessagesType.ALL_MESSAGES;
  const botMessage = (message, bot) => {
    return (
      <SlackMessagePrototype
        message={message}
        icon={bot && bot.profile.image_48}
        username={message.username}
        showChannel={showChannel}
        teamInfo={teamInfo}
        channel={channel}
        text={message.text}
        messageRef={messageRef}
        selected={selected}
      />
    );
  };
  const normalMessage = (message, user) => {
    return (
      <SlackMessagePrototype
        message={message}
        icon={user && user.profile.image_48}
        username={
          user && user.profile
            ? user.profile.display_name != ""
              ? user.profile.display_name
              : user.profile.real_name
            : "あいうえお"
        }
        showChannel={showChannel}
        teamInfo={teamInfo}
        channel={channel}
        text={message.text}
        messageRef={messageRef}
        selected={selected}
      />
    );
  };

  switch (message.subtype) {
    case "bot_message":
      return botMessage(message, getBot(message.bot_id));
    default:
      return normalMessage(message, getUser(message.user));
  }
};

export default MessageItem;

// import React, { Component } from "react";
// import MessagesType from "../../constants/MessagesType";
// import SlackMessagePrototype from "../Messagelist/SlackMessagePrototype";

// const MessageItem = ({
//   message,
//   selected,
//   type,
//   channels,
//   users,
//   bots,
//   ims,
//   teamInfo,
//   messageRef,
// }) => {
//   if (message.hidden) {
//     return null;
//   }
//   const getChannel = (id) => {
//     if (channels && channels[id]) {
//       return channels[id];
//     }
//     if (ims && ims[id]) {
//       return ims[id];
//     }
//   };
//   const getUser = (id) => {
//     return users && users[id];
//   };
//   const getBot = (id) => {
//     return bots && bots[id];
//   };
//   const channel = getChannel(message.channel);
//   const showChannel =
//     type === MessagesType.SEARCH_MESSAGES || type === MessagesType.ALL_MESSAGES;
//   const botMessage = (
//     teamInfo,
//     message,
//     bot,
//     channel,
//     showChannel,
//     selected
//   ) => {
//     return (
//       <SlackMessagePrototype
//         message={message}
//         icon={bot && bot.profile.image_48}
//         username={message.username}
//         showChannel={showChannel}
//         teamInfo={teamInfo}
//         channel={channel}
//         text={message.text}
//         messageRef={messageRef}
//         selected={selected}
//       />
//     );
//   };
//   const normalMessage = (
//     teamInfo,
//     message,
//     user,
//     channel,
//     showChannel,
//     selected
//   ) => {
//     return (
//       <SlackMessagePrototype
//         message={message}
//         icon={user && user.profile.image_48}
//         username={
//           user && user.profile
//             ? user.profile.display_name != ""
//               ? user.profile.display_name
//               : user.profile.real_name
//             : "あいうえお"
//         }
//         showChannel={showChannel}
//         teamInfo={teamInfo}
//         channel={channel}
//         text={message.text}
//         messageRef={messageRef}
//         selected={selected}
//       />
//     );
//   };

//   switch (message.subtype) {
//     case "bot_message":
//       return botMessage(
//         teamInfo,
//         message,
//         getBot(message.bot_id),
//         channel,
//         showChannel,
//         selected
//       );
//     default:
//       return normalMessage(
//         teamInfo,
//         message,
//         getUser(message.user),
//         channel,
//         showChannel,
//         selected
//       );
//   }
// };

// export default MessageItem;

// export default class MessageItem extends Component {
//   getChannel(id) {
//     const channels = this.props.channels;
//     const ims = this.props.ims;
//     if (channels && channels[id]) {
//       return channels[id];
//     }
//     if (ims && ims[id]) {
//       return ims[id];
//     }
//   }
//   getUser(id) {
//     const users = this.props.users;
//     return users && users[id];
//   }
//   getBot(id) {
//     const bots = this.props.bots;
//     return bots && bots[id];
//   }

//   render() {
//     const botMessage = (
//       teamInfo,
//       message,
//       bot,
//       channel,
//       showChannel,
//       selected
//     ) => {
//       return (
//         <SlackMessagePrototype
//           message={message}
//           icon={bot && bot.profile.image_48}
//           username={message.username}
//           showChannel={showChannel}
//           teamInfo={teamInfo}
//           channel={channel}
//           text={message.text}
//           messageRef={this.props.messageRef}
//           selected={selected}
//         />
//       );
//     };
//     const normalMessage = (
//       teamInfo,
//       message,
//       user,
//       channel,
//       showChannel,
//       selected
//     ) => {
//       return (
//         <SlackMessagePrototype
//           message={message}
//           icon={user && user.profile.image_48}
//           username={
//             user && user.profile
//               ? user.profile.display_name != ""
//                 ? user.profile.display_name
//                 : user.profile.real_name
//               : "あいうえお"
//           }
//           showChannel={showChannel}
//           teamInfo={teamInfo}
//           channel={channel}
//           text={message.text}
//           messageRef={this.props.messageRef}
//           selected={selected}
//         />
//       );
//     };

//     if (this.props.message.hidden) {
//       return null;
//     }

//     const message = this.props.message;
//     const channel = this.getChannel(message.channel);
//     const selected = this.props.selected;
//     const showChannel =
//       this.props.type === MessagesType.SEARCH_MESSAGES ||
//       this.props.type === MessagesType.ALL_MESSAGES;
//     switch (message.subtype) {
//       case "bot_message":
//         return botMessage(
//           this.props.teamInfo,
//           message,
//           this.getBot(message.bot_id),
//           channel,
//           showChannel,
//           selected
//         );
//       default:
//         return normalMessage(
//           this.props.teamInfo,
//           message,
//           this.getUser(message.user),
//           channel,
//           showChannel,
//           selected
//         );
//     }
//   }
// }
