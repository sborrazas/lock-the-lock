import { Observable } from "rxjs";
import { Action } from "redux";
import { ofType } from "redux-observable";
import { ignoreElements, tap } from "rxjs/operators";

import { UiActionTypes } from "./actions";

export default function (action$: Observable<Action>): Observable<UiActionTypes> {
  return action$.pipe(
    // ofType(START_CREATING_LOCK),
    // tap(item => console.log("ITEM", item)),
    ignoreElements()
  );
};
