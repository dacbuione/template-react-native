import {combineReducers} from 'redux';
import appReducer from './appReducer.js';
const rootReducers = combineReducers({
  app: appReducer,
});

export default rootReducers;
