import { Observable } from "rxjs";
import { ofType } from "redux-observable";
import { ignoreElements, map, mergeMap } from "rxjs/operators";

import { locks } from "../api";

import { ActionTypes } from "../actions";

import { CREATE_LOCK, LocksActionTypes, CreateLockAction } from "./actions";

import { LocksState } from "./reducer";

export default (action$: Observable<ActionTypes>, state: LocksState): Observable<ActionTypes> => {
  console.log(state);

  return action$.pipe(
    ofType<ActionTypes, CreateLockAction, LocksActionTypes["type"]>(CREATE_LOCK),
    mergeMap((item: CreateLockAction) => {
      return locks.create(item.payload).pipe(
        map(response => { console.log("response", response); return ignoreElements(); }),
        ignoreElements()
      );
    })
  );
};
