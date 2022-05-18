import React, { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import SearchMessagesHeader from "./SearchMessagesHeader";
import MessagesList from "../Messagelist/MessagesList";
import SlackActions from "../../actions/SlackActions";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
const SearchMessagesSection = (props) => {
  const { match } = props;
  const searchWord = match.params.searchWord;
  let searchWordPrev = usePrevious(searchWord);

  const dispatch = useDispatch();
  const loadMoreSearchMessages = (searchWord) => (params) => {
    dispatch(SlackActions.searchMore(searchWord, params));
  };
  const loadSearchMessages = (searchWord) => {
    dispatch(SlackActions.search(searchWord));
  };
  const initialzeData = (searchWord) => {
    loadSearchMessages(decodeURIComponent(searchWord));
  };
  useEffect(() => {
    if (searchWord !== searchWordPrev) {
      initialzeData(searchWord);
    }
  }, [searchWord]);

  return (
    <div className="search-messages">
      <SearchMessagesHeader searchWord={searchWord} />
      <MessagesList onLoadMoreMessages={loadMoreSearchMessages(searchWord)} />
    </div>
  );
};
export default SearchMessagesSection;
// class SearchMessagesSection extends React.Component {
//   componentDidMount() {
//     this.initialzeData(this.props.match.params.searchWord);
//   }
//   UNSAFE_componentWillReceiveProps(nextProps) {
//     if (
//       this.props.match.params.searchWord !== nextProps.match.params.searchWord
//     ) {
//       this.initialzeData(nextProps.match.params.searchWord);
//     }
//   }
//   initialzeData(searchWord) {
//     this.props.loadSearchMessages(decodeURIComponent(searchWord));
//   }
//   render() {
//     const { match, loadMoreSearchMessages } = this.props;
//     const searchWord = match.params.searchWord;
//     return (
//       <div className="search-messages">
//         <SearchMessagesHeader searchWord={searchWord} />
//         <MessagesList onLoadMoreMessages={loadMoreSearchMessages(searchWord)} />
//       </div>
//     );
//   }
// }
