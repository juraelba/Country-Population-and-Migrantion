import { createBrowserHistory } from 'history'
import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import reducer from './Reducers/index.js';
import { createLogger } from 'redux-logger';

const history = createBrowserHistory();

const RouterMiddleware = routerMiddleware(history);

const getMiddlewares = () => {
    if (process.env.NODE_ENV === 'production') {
        return applyMiddleware(RouterMiddleware);
    }
    else {
        return applyMiddleware(RouterMiddleware, createLogger());
    }
};

const configureStore = (preloadedState) => {
  const store = createStore(
    reducer(history), // root reducer with router state
    preloadedState,
    compose( getMiddlewares() )
  )

  return store
}

export { history, configureStore }