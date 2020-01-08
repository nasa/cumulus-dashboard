import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from '../reducers';
import { refreshTokenMiddleware } from '../middleware/token';
import { requestMiddleware } from '../middleware/request';
import thunkMiddleware from 'redux-thunk';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const history = createBrowserHistory();

export default function configureStore (preloadedState) {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    compose(
      applyMiddleware(
        routerMiddleware(history), // for dispatching history actions
        composeEnhancers(
          refreshTokenMiddleware,
          requestMiddleware,
          thunkMiddleware
        )
      ),
    ),
  );

  return store;
}
