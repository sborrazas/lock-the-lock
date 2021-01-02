import { combineReducers } from "redux";

import locksReducer from "./locks/reducer";
import uiReducer from "./ui/reducer";
import tokenReducer from "./token/reducer";

const rootReducer = combineReducers({
  locks: locksReducer,
  ui: uiReducer,
  token: tokenReducer
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
