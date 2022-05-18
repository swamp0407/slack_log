import SlackConstants from '../constants/SlackConstants';

const bots = (state = {}, action) => {
  switch (action.type) {
    case SlackConstants.UPDATE_BOTS:
      return action.bots;
    default:
      return state;
  }
};

export default bots;
