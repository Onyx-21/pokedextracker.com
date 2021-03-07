import { SET_SHOW_EXTRA_LINKS } from '../actions/tracker';

const INITIAL_STATE = false;

export function showExtraLinks(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_SHOW_EXTRA_LINKS:
      return action.show;
    default:
      return state;
  }
}
