import channels from './channelsReducer';
import searchWord from './searchWordReducer';
import teamInfo from './teamInfoReducer';
import users from './usersReducer';
import bots from './botsReducer';
import messages from './messagesReducer';
import isMessageLoading from './isMessageLoadingReducer';
import resize from './resizeReducer';

// reducers.js
import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  channels,
  searchWord,
  teamInfo,
  users,
  bots,
  messages,
  resize,
  isMessageLoading
})
export default createRootReducer


