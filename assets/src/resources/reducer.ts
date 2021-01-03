import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { History } from "history";

import locksReducer from "./locks/reducer";
import uiReducer from "./ui/reducer";
import tokenReducer from "./token/reducer";

const createRootReducer = (history: History) => combineReducers({
  router: connectRouter(history),
  locks: locksReducer,
  ui: uiReducer,
  token: tokenReducer,
});

export default createRootReducer;

export type RootState = ReturnType<ReturnType<typeof createRootReducer>>;
