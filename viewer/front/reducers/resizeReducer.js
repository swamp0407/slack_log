import OnConstants from '../constants/OnConstants';

const resize = (state = { move: false, prediffx: 0, prediffy: 0, diffx: 0, diffy: 0, startx: 0, starty: 0, dx: 0, dy: 0 }, action) => {
  switch (action.type) {
    case OnConstants.MOUSEDOWN:
      return {
        move: true,
        startx: action.x,
        starty: action.y,
        prediffx: state.prediffx,
        prediffy: state.prediffy,
        diffx: 0,
        diffy: 0,
        dx: state.prediffx + state.diffx,
        dy: state.prediffy + state.diffy,
      };
    case OnConstants.MOUSEUP:
      return {
        move: false,
        startx: state.startx,
        starty: state.starty,
        prediffx: state.prediffx + state.diffx,
        prediffy: state.prediffy + state.diffy,
        diffx: 0,
        diffy: 0,
        dx: state.prediffx + state.diffx,
        dy: state.prediffy + state.diffy,
      };
    case OnConstants.MOUSEMOVE:
      return {
        move: state.move,
        startx: state.startx,
        starty: state.starty,
        prediffx: state.prediffx,
        prediffy: state.prediffy,
        diffx: action.x - state.startx,
        diffy: action.y - state.starty,
        dx: state.prediffx + action.x - state.startx,
        dy: state.prediffy + action.y - state.starty,
      }
    default:
      return state;
  }
};

export default resize;
