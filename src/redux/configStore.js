import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers/rootReducer';
import rootSaga from './sagas/rootSaga';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];
const configStore = initialState => {
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middlewares),
  );
  sagaMiddleware.run(rootSaga);
  return store;
};

export default configStore;
