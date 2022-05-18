import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import SlackMessage from "./MessageItem";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const MessagesList = ({ onLoadMoreMessages, scrollToTs }) => {
  const messages = useSelector((state) => state.messages.messages);
  const hasMorePastMessage = useSelector(
    (state) => state.messages.hasMorePastMessage
  );
  const hasMoreFutureMessage = useSelector(
    (state) => state.messages.hasMoreFutureMessage
  );
  const messagesInfo = useSelector((state) => state.messages.messagesInfo);
  const users = useSelector((state) => state.users);
  const bots = useSelector((state) => state.bots);
  const channels = useSelector((state) => state.channels.channels);
  const ims = useSelector((state) => state.channels.ims);
  const teamInfo = useSelector((state) => state.teamInfo);

  const prevmessages = usePrevious(messages);
  const prevmessageInfo = usePrevious(messagesInfo);
  const prevscrollToTs = usePrevious(scrollToTs);

  const messagesList = useRef(null);
  const [state, setState] = useState({
    isLoadingMore: false,
    isLoadingPast: false,
  });
  const [previousHeight, setPreviousHeight] = useState();
  const [previousTop, setPreviousTop] = useState();
  const tsToNode = useRef({});
  const scrollToLastMessage = () => {
    // $(this.refs.messagesList).scrollTop(this.currentHeight());
    messagesList.current.scrollTo(0, currentHeight());
  };
  const currentHeight = () => {
    return messagesList.current.scrollHeight;
  };
  const handleLoadMore = (isPast) => {
    if (state.isLoadingMore) {
      return;
    }

    setState({
      isLoadingMore: true,
      isLoadingPast: isPast,
    });
    setPreviousHeight(currentHeight());
    setPreviousTop(messagesList.current.scrollTop);

    const oldestTs = messages.length > 0 && messages[0].ts;
    const latestTs = messages.length > 0 && messages[messages.length - 1].ts;
    onLoadMoreMessages({
      isPast,
      limitTs: isPast ? oldestTs : latestTs,
    });
  };

  // useEffect(()=>{
  //   scrollToLastMessage();
  //   if (scrollToTs) {
  //     scrollToTsAfterUpdate = true;
  //   } else {
  //     scrollToLastMessageAfterUpdate = true;
  //   }
  // }
  // ,[])
  useEffect(() => {
    // first view
    if (messagesInfo !== prevmessageInfo || scrollToTs !== prevscrollToTs) {
      if (scrollToTs) {
        const node = tsToNode.current[scrollToTs];
        if (node) {
          const offsetTop =
            node.current.getBoundingClientRect().top +
            messagesList.current.scrollTop;
          messagesList.current.scrollTo(
            0,
            offsetTop - node.current.offsetHeight
          );
        }
      } else {
        scrollToLastMessage();
      }
    }
    if (state.isLoadingMore && messages !== prevmessages) {
      setState({ isLoadingMore: false });
      if (state.isLoadingPast) {
        messagesList.current.scrollTo(
          0,
          currentHeight() - (previousHeight || 0)
        );
      } else {
        messagesList.current.scrollTo(0, previousTop || 0);
      }
    }
  }, [
    state,
    messagesInfo,
    scrollToTs,
    messagesList,
    messages,
    previousHeight,
    previousTop,
  ]);

  const createMessages = (messages) =>
    messages.map((message) => {
      tsToNode.current[message.ts] = React.createRef();
      return (
        <SlackMessage
          message={message}
          users={users}
          bots={bots}
          teamInfo={teamInfo}
          channels={channels}
          ims={ims}
          key={message.ts}
          type={messagesInfo.type}
          selected={message.ts === scrollToTs}
          messageRef={tsToNode.current[message.ts]}
        />
      );
    });
  const loadMoreSection = (isPast) => {
    if (isPast && !hasMorePastMessage) {
      return;
    }
    if (!isPast && !hasMoreFutureMessage) {
      return;
    }

    if (state.isLoadingMore && state.isLoadingPast === isPast) {
      return <div className="messages-load-more loading">Loading...</div>;
    } else {
      return (
        <div
          className="messages-load-more"
          onClick={handleLoadMore.bind(this, isPast)}
        >
          Load more messages...
        </div>
      );
    }
  };

  return (
    <div className="messages-list" ref={messagesList}>
      {loadMoreSection(true)}
      {createMessages(messages)}
      {loadMoreSection(false)}
    </div>
  );
};

export default MessagesList;

/*
class MessagesList extends React.Component {
  constructor(props) {
    super(props);
    // [state, setState] = useState({
    //   isLoadingMore: false,
    //   isLoadingPast: false
    // })
    this.state = {
      isLoadingMore: false,
      isLoadingPast: false,
    };
  }

  scrollToLastMessage() {
    // $(this.refs.messagesList).scrollTop(this.currentHeight());
    this.refs.messagesList.scrollTo(0, this.currentHeight());
  }
  currentHeight() {
    return this.refs.messagesList.scrollHeight;
  }
  handleLoadMore(isPast) {
    if (this.state.isLoadingMore) {
      return;
    }

    this.setState({
      isLoadingMore: true,
      isLoadingPast: isPast,
    });
    this.previousHeight = this.currentHeight();
    this.previousTop = this.refs.messagesList.scrollTop;

    const oldestTs =
      this.props.messages.length > 0 && this.props.messages[0].ts;
    const latestTs =
      this.props.messages.length > 0 &&
      this.props.messages[this.props.messages.length - 1].ts;
    this.props.onLoadMoreMessages({
      isPast,
      limitTs: isPast ? oldestTs : latestTs,
    });
  }
  componentDidMount() {
    this.scrollToLastMessage();
  }
  componentDidUpdate() {
    console.log("componentDidUpdate");
    if (this.scrollBackAfterUpdate) {
      // fix scrollTop when load more messages
      if (this.state.isLoadingPast) {
        this.refs.messagesList.scrollTo(
          0,
          this.currentHeight() - (this.previousHeight || 0)
        );
      } else {
        this.refs.messagesList.scrollTo(0, this.previousTop || 0);
      }
      this.scrollBackAfterUpdate = false;
    }
    if (this.scrollToLastMessageAfterUpdate) {
      this.scrollToLastMessage();
      this.scrollToLastMessageAfterUpdate = false;
    }
    if (this.scrollToTsAfterUpdate) {
      const node = this.tsToNode[this.props.scrollToTs];
      if (node) {
        // console.log("offset top ", $(node).offset().top);
        const offsetTop =
          node.getBoundingClientRect().top + this.refs.messagesList.scrollTop;
        this.refs.messagesList.scrollTo(0, offsetTop - node.offsetHeight);
      }
      this.scrollToTsAfterUpdate = false;
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log("UNSAFE_componentwill");
    // TODO: create reducer which manage scroll state
    // loading more
    if (
      this.state.isLoadingMore &&
      nextProps.messages !== this.props.messages
    ) {
      this.scrollBackAfterUpdate = true;
      this.setState({ isLoadingMore: false });
    }

    // first view
    if (
      nextProps.messagesInfo !== this.props.messagesInfo ||
      nextProps.scrollToTs !== this.props.scrollToTs
    ) {
      if (this.props.scrollToTs) {
        this.scrollToTsAfterUpdate = true;
      } else {
        this.scrollToLastMessageAfterUpdate = true;
      }
    }
  }
  render() {
    this.tsToNode = {};

    const createMessages = (messages) =>
      messages.map((message) => (
        <SlackMessage
          message={message}
          users={this.props.users}
          bots={this.props.bots}
          teamInfo={this.props.teamInfo}
          channels={this.props.channels}
          ims={this.props.ims}
          key={message.ts}
          type={this.props.messagesInfo.type}
          selected={message.ts === this.props.scrollToTs}
          messageRef={(n) => (this.tsToNode[message.ts] = n)}
        />
      ));
    const loadMoreSection = (isPast) => {
      if (isPast && !this.props.hasMorePastMessage) {
        return;
      }
      if (!isPast && !this.props.hasMoreFutureMessage) {
        return;
      }

      if (this.state.isLoadingMore && this.state.isLoadingPast === isPast) {
        return <div className="messages-load-more loading">Loading...</div>;
      } else {
        return (
          <div
            className="messages-load-more"
            onClick={this.handleLoadMore.bind(this, isPast)}
          >
            Load more messages...
          </div>
        );
      }
    };

    return (
      <div className="messages-list" ref="messagesList">
        {loadMoreSection(true)}
        {createMessages(this.props.messages)}
        {loadMoreSection(false)}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    messages: state.messages.messages,
    hasMorePastMessage: state.messages.hasMorePastMessage,
    hasMoreFutureMessage: state.messages.hasMoreFutureMessage,
    messagesInfo: state.messages.messagesInfo,
    users: state.users,
    bots: state.bots,
    channels: state.channels.channels,
    ims: state.channels.ims,
    teamInfo: state.teamInfo,
  };
};

export default connect(mapStateToProps)(MessagesList);
*/
