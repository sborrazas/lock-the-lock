import { createBrowserHistory } from "history";
import { createEpicMiddleware } from "redux-observable";
import { applyMiddleware, createStore, compose } from "redux";
import { routerMiddleware } from "connected-react-router";

import rootEpic from "./resources/epic";
import createRootReducer, { RootState } from "./resources/reducer";

import { ActionTypes } from "./resources/actions";

const epicMiddleware = createEpicMiddleware<ActionTypes, ActionTypes, RootState>();

export const history = createBrowserHistory();

export default () => {
  const rootReducer = createRootReducer(history);
  const store = createStore(
    rootReducer,
    compose(
      applyMiddleware(
        epicMiddleware,
        routerMiddleware(history)
      )
    )
  );

  epicMiddleware.run(rootEpic);

  return store;
};
