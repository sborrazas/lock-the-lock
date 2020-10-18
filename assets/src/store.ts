import { createEpicMiddleware } from "redux-observable";
import { applyMiddleware, createStore } from "redux";
import rootEpic from "./resources/epic";
import rootReducer from "./resources/reducer";

const epicMiddleware = createEpicMiddleware();

export default () => {
  const store = createStore(rootReducer, applyMiddleware(epicMiddleware));

  epicMiddleware.run(rootEpic);

  return store;
};
