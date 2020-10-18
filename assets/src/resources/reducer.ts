import { combineReducers } from "redux";

import locksReducer from "./locks/reducer";

const rootReducer = combineReducers({
  locks: locksReducer
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
