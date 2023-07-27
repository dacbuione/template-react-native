import {combineReducers} from 'redux';
import appReducer from './app-reducer.js';
const rootReducers = combineReducers({
  app: appReducer,
});

export default rootReducers;
