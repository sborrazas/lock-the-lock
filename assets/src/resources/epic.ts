import { combineEpics } from "redux-observable";

import locksEpic from "./locks/epic";
import uiEpic from "./ui/epic";

export default combineEpics(
  locksEpic,
  uiEpic
);
