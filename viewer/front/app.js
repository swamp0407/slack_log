import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

// import createHistory from 'history/createBrowserHistory';
import { createBrowserHistory } from 'history';
import { routerMiddleware, ConnectedRouter } from 'connected-react-router'
import createRootReducer from './reducers';
import Slack from './containers/Slack';
import SlackActions from './actions/SlackActions';

import 'normalize.css/normalize.css';
import './app.less';

const history = createBrowserHistory();
const middleware = routerMiddleware(history);

const store = createStore(
  createRootReducer(history),
  applyMiddleware(middleware, thunkMiddleware)
);

// initialize data
store.dispatch(SlackActions.getUsers());
store.dispatch(SlackActions.getBots());
store.dispatch(SlackActions.getTeamInfo());
store.dispatch(SlackActions.getChannels());
store.dispatch(SlackActions.getIms());

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Slack />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app')
);
