import { combineReducers } from "redux";

import locksReducer from "./locks/reducer";
import uiReducer from "./ui/reducer";

const rootReducer = combineReducers({
  locks: locksReducer,
  ui: uiReducer
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
