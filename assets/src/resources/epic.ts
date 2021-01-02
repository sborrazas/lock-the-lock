import { StateObservable } from "redux-observable";
import { Observable, merge } from "rxjs";

import { RootState } from "./reducer";
import { ActionTypes } from "./actions";

import locksEpic from "./locks/epic";
import uiEpic from "./ui/epic";

export default (action$: Observable<ActionTypes>, state$: StateObservable<RootState>): Observable<ActionTypes> => {
  return merge(
    locksEpic(action$, state$.value.locks),
    uiEpic(action$, state$.value.ui)
  );
};
