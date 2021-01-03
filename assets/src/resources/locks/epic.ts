import { Action } from "redux";
import { Observable } from "rxjs";
import { ofType } from "redux-observable";
import { map, mergeMap } from "rxjs/operators";

import { locks, SUCCESS, Response } from "../api";

import {
  CREATE_LOCK,
  CreateLockAction,
  createLockSuccess,
  createLockFailure
} from "./actions";
import { LocksState } from "./reducer";
import { Lock } from "./types";

export default (action$: Observable<Action>, state: LocksState): Observable<Action> => {
  return action$.pipe(
    ofType<Action, CreateLockAction, typeof CREATE_LOCK>(CREATE_LOCK),
    mergeMap((item: CreateLockAction) => {
      return locks.create(item.payload).pipe(
        map((response: Response<Lock>) => {
          if (response.type === SUCCESS) {
            return createLockSuccess(response.entity);
          }
          else {
            return createLockFailure(response.errors);
          }
        })
      );
    })
  );
};
