import { combineEpics } from "redux-observable";

import locksEpic from "./locks/epic";

export default combineEpics(
  locksEpic
);
