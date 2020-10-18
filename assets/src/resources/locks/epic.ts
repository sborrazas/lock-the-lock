import { Observable } from "rxjs";
import { Action } from "redux";
import { ofType } from "redux-observable";
import { ignoreElements, tap } from "rxjs/operators";

import { CREATE_LOCK, LocksActionTypes } from "./actions";

export default function (action$: Observable<Action>): Observable<LocksActionTypes> {
  return action$.pipe(
    ofType(CREATE_LOCK),
    tap(item => console.log("ITEM", item)),
    ignoreElements()
  );
};
