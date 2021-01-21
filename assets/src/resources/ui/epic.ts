import { Action } from "redux";
import { Observable, merge } from "rxjs";
import { ofType } from "redux-observable";
import { map } from "rxjs/operators";
import { push } from "connected-react-router";

import { UiState } from "./reducer";

import {
  CREATE_SUCCESS,
  CREATE_FAILURE,
  LOCK_SUBSCRIBE_FAILURE,
  CreateLockSuccessAction,
  CreateLockFailureAction,
  LockSubscribeFailureAction
} from "../locks/actions";

import {
  setErrors
} from "./actions";

export default function (action$: Observable<Action>, state$: UiState): Observable<Action> {
  return merge<Action, Action>(
    action$.pipe(
      ofType<Action, CreateLockSuccessAction, typeof CREATE_SUCCESS>(CREATE_SUCCESS),
      map(({ payload: id }: CreateLockSuccessAction) => push(`${id}`))
    ),
    action$.pipe(
      ofType<Action, CreateLockFailureAction, typeof CREATE_FAILURE>(CREATE_FAILURE),
      map(({ payload: errors }: CreateLockFailureAction) => setErrors("createLock", errors))
    ),
    action$.pipe(
      ofType<Action, LockSubscribeFailureAction, typeof LOCK_SUBSCRIBE_FAILURE>(LOCK_SUBSCRIBE_FAILURE),
      map(({ payload: { errors } }: LockSubscribeFailureAction) => setErrors("lockSettings", errors))
    )
  );
};
