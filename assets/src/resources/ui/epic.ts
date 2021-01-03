import { Action } from "redux";
import { Observable, merge } from "rxjs";
import { ofType } from "redux-observable";
import { map } from "rxjs/operators";
import { push } from "connected-react-router";

import { UiState } from "./reducer";

import {
  CREATE_LOCK_SUCCESS,
  CREATE_LOCK_FAILURE,
  CreateLockSuccessAction,
  CreateLockFailureAction
} from "../locks/actions";

import {
  setErrors
} from "./actions";

export default function (action$: Observable<Action>, state$: UiState): Observable<Action> {
  return merge<Action, Action>(
    action$.pipe(
      ofType<Action, CreateLockSuccessAction, typeof CREATE_LOCK_SUCCESS>(CREATE_LOCK_SUCCESS),
      map(({ payload: { id } }: CreateLockSuccessAction) => push(`${id}`))
    ),
    action$.pipe(
      ofType<Action, CreateLockFailureAction, typeof CREATE_LOCK_FAILURE>(CREATE_LOCK_FAILURE),
      map(({ payload: errors }: CreateLockFailureAction) => setErrors("createLock", errors))
    )
  );
};
