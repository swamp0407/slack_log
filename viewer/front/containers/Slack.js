import React from "react";
import { useDispatch, useSelector } from "react-redux";
import SidebarContainer from "./SidebarContainer/SidebarContainer";
import Resizable from "./ResizeContainer/Resizable";
import MessagesContainer from "./MessageContainer/MessagesContainer";
import SearchForm from "./SearchForm/SearchForm";
import SlackActions from "../actions/SlackActions";

const Slack = (props) => {
  const dispatch = useDispatch();
  const mouseDown = (event) => {
    dispatch(SlackActions.startResize(event));
  };
  const mouseUp = () => {
    dispatch(SlackActions.endResize());
  };
  const mouseMove = (event) => {
    dispatch(SlackActions.doResize(event));
  };

  // const channel = this.props.match.params.channel;
  const move = useSelector((state) => state.resize.move);
  return (
    <div className="slack">
      {move ? (
        <div className="wrapper" onMouseUp={mouseUp} onMouseMove={mouseMove}>
          <SidebarContainer />
          <Resizable />
          <MessagesContainer />
          <SearchForm />
        </div>
      ) : (
        <div className="wrapper">
          <SidebarContainer />
          <Resizable onMouseDown={mouseDown} />
          <MessagesContainer />
          <SearchForm />
        </div>
      )}
    </div>
  );
};

export default Slack;
