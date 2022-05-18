import React from "react";
import { useSelector } from "react-redux";
import { Route, Switch } from "react-router";
import SearchMessages from "../../components/SearchMessage/SearchMessages";
import ChannelMessages from "../../components/ChannelMessage/ChannelMessages";
import config from "../../config";

import "./MessagesContainer.less";
const MessagesSection = (props) => {
  const isMessageLoading = useSelector((state) => state.isMessageLoading);
  const dx = useSelector((state) => state.resize.dx);
  // const width = `calc(document.body.clientWidth - 270 - dx)`;
  const width = `calc(100% - 270px - ${dx}px)`;
  return (
    <div
      className="messages"
      style={{
        float: "left",
        height: "100%",
        position: "relative",
        width: width,
      }}
    >
      {isMessageLoading ? (
        <div className="loading-messages">
          <h2 className="title">Now loading...</h2>
          <div className="loading-wrap">
            <div className="loader"></div>
          </div>
        </div>
      ) : null}
      <Switch>
        <Route
          path={config.subdir + "/search/:searchWord"}
          component={SearchMessages}
        />
        <Route
          path={config.subdir + "/:channel/:ts"}
          component={ChannelMessages}
        />
        <Route path={config.subdir + "/:channel"} component={ChannelMessages} />
        <Route path={config.subdir + "/"} component={ChannelMessages} />
      </Switch>
    </div>
  );
};

export default MessagesSection;
