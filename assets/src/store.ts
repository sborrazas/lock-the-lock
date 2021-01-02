import { createEpicMiddleware } from "redux-observable";
import { applyMiddleware, createStore } from "redux";
import rootEpic from "./resources/epic";
import rootReducer, { RootState } from "./resources/reducer";

import { ActionTypes } from "./resources/actions";

const epicMiddleware = createEpicMiddleware<ActionTypes, ActionTypes, RootState>();

export default () => {
  const store = createStore(rootReducer, applyMiddleware(epicMiddleware));

  epicMiddleware.run(rootEpic);

  return store;
};
