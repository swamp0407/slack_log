import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import ChannelMessagesHeader from "./ChannelMessagesHeader";
import MessagesList from "../Messagelist/MessagesList";
import SlackActions from "../../actions/SlackActions";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function ChannelMessages(props) {
  const dispatch = useDispatch();
  const loadMoreChannelMessages = (channel) => (params) => {
    dispatch(SlackActions.getMoreMessages(channel, params));
  };
  const loadChannelMessages = (channel, ts) => {
    if (ts) {
      if (channel == "all") {
        dispatch(SlackActions.getAroundMessagesAll(ts));
      } else {
        dispatch(SlackActions.getAroundMessages(channel, ts));
      }
    } else if (channel) {
      dispatch(SlackActions.getMessages(channel));
    } else {
      // 「/」にだけ引っかかる
      dispatch(SlackActions.search(".*"));
    }
  };
  const initializeData = (channel, ts) => {
    loadChannelMessages(channel, ts);
  };

  // const router = useSelector((state) => state.router);
  let channelPrev = usePrevious(props.match.params.channel);
  let tsPrev = usePrevious(props.match.params.ts);
  // useEffect(() => {
  //   initializeData(props.match.params.channel, props.match.params.ts);
  // }, []); 1回のみ実行ができるけど下にまとめた
  useEffect(() => {
    if (
      (!channelPrev && !tsPrev) ||
      props.match.params.channel !== channelPrev ||
      props.match.params.ts !== tsPrev
    ) {
      initializeData(props.match.params.channel, props.match.params.ts);
    }
  }, [props.match.params.channel, props.match.params.ts]);
  const channel = props.match.params.channel;
  return (
    <div className="channel-messages">
      <ChannelMessagesHeader currentChannelId={channel} />
      <MessagesList
        scrollToTs={props.match.params.ts}
        onLoadMoreMessages={loadMoreChannelMessages(channel)}
      />
    </div>
  );
}
export default ChannelMessages;

// class ChannelMessages extends React.Component {
//   componentDidMount() {
//     this.initialzeData(
//       this.props.match.params.channel,
//       this.props.match.params.ts
//     );
//   }
//   UNSAFE_componentWillReceiveProps(nextProps) {
//     if (
//       this.props.match.params.channel !== nextProps.match.params.channel ||
//       this.props.match.params.ts !== nextProps.match.params.ts
//     ) {
//       this.initialzeData(
//         nextProps.match.params.channel,
//         nextProps.match.params.ts
//       );
//     }
//   }
//   initialzeData(channel, ts) {
//     this.props.loadChannelMessages(channel, ts);
//   }
//   render() {
//     const channel = this.props.match.params.channel;
//     return (
//       <div className="channel-messages">
//         <ChannelMessagesHeader currentChannelId={channel} />
//         <MessagesList
//           scrollToTs={this.props.match.params.ts}
//           onLoadMoreMessages={this.props.loadMoreChannelMessages(channel)}
//         />
//       </div>
//     );
//   }
// }

// const mapStateToProps = (state) => {
//   return {
//     router: state.router,
//   };
// };
// const mapDispatchToProps = (dispatch) => {
//   return {
//     loadMoreChannelMessages: (channel) => (params) => {
//       dispatch(SlackActions.getMoreMessages(channel, params));
//     },
//     loadChannelMessages: (channel, ts) => {
//       if (ts) {
//         if (channel == "all") {
//           dispatch(SlackActions.getAroundMessagesAll(ts));
//         } else {
//           dispatch(SlackActions.getAroundMessages(channel, ts));
//         }
//       } else if (channel) {
//         dispatch(SlackActions.getMessages(channel));
//       } else {
//         // 「/」にだけ引っかかる
//         dispatch(SlackActions.search(".*"));
//       }
//     },
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(ChannelMessages);
