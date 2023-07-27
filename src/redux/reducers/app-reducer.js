import * as appTypes from '../types/app-types';
import {INITIALIZING_APP_STATE} from '../../commons/constants';
const initialState = {
  initializing: INITIALIZING_APP_STATE.LOGIN_SCREEN,
  user: undefined,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case appTypes.APP_INITIALIZING_CHANGED:
      return {
        ...state,
        initializing: action.initializing,
      };
    default:
      break;
  }
  return state;
}
