import { Action } from "redux";
import { Observable, merge } from "rxjs";
import { ofType } from "redux-observable";
import { map, mergeMap } from "rxjs/operators";

import {
  locks,
  SUCCESS,
  LOCK_SUB_OUTPUT_SUBSCRIBE_SUCCESS,
  LOCK_SUB_OUTPUT_SUBSCRIBE_FAILED,
  LOCK_SUB_OUTPUT_LOCKED,
  LOCK_SUB_OUTPUT_UNLOCKED,
  LOCK_SUB_OUTPUT_USER_ADDED,
  LOCK_SUB_OUTPUT_TIMEOUT_UPDATED,
  LOCK_SUB_OUTPUT_FAILED,
  LOCK_SUB_OUTPUT_CRITICALLY_FAILED,
  Response,
  LockSubInputMsg,
  LockSubOutputMsg
} from "../api";

import {
  CREATE,
  LOCK_SUBSCRIBE,
  LOCK_LOCK,
  CreateLockAction,
  LockSubscribeAction,
  LockLockAction,
  createLockSuccess,
  createLockFailure,
  lockSubscribeSuccess,
  lockSubscribeFailure,
  lockLocked,
  lockUnlocked,
  lockUserAdded,
  lockTimeoutUpdated,
  lockFailed,
  lockCriticallyFailed
} from "./actions";
import { LocksState } from "./reducer";
import { NewLock, LockId } from "./types";

export default (action$: Observable<Action>, state: LocksState): Observable<Action> => {
  const wsInputObservable: Observable<LockSubInputMsg> = merge<Action, LockSubInputMsg>(
    action$.pipe(
      ofType<Action, LockLockAction, typeof LOCK_LOCK>(LOCK_LOCK),
      map((action: LockLockAction) => {
        return 1;
      })
    )
  );

  return merge<Action, Action>(
    action$.pipe(
      ofType<Action, CreateLockAction, typeof CREATE>(CREATE),
      mergeMap((item: CreateLockAction) => {
        return locks.create(item.payload).pipe(
          map((response: Response<NewLock, { id: LockId }>) => {
            if (response.type === SUCCESS) {
              return createLockSuccess(response.entity.id);
            }
            else {
              return createLockFailure(response.errors);
            }
          })
        );
      })
    ),
    action$.pipe(
      ofType<Action, LockSubscribeAction, typeof LOCK_SUBSCRIBE>(LOCK_SUBSCRIBE),
      mergeMap((item: LockSubscribeAction) => {
        const lockId = item.payload.lockId;

        return locks.subscribe(lockId, item.payload.username, wsInputObservable).pipe(
          map<LockSubOutputMsg, Action>((msg: LockSubOutputMsg) => {
            switch (msg.type) {
              case LOCK_SUB_OUTPUT_SUBSCRIBE_SUCCESS:
                return lockSubscribeSuccess(
                  lockId,
                  msg.users,
                  msg.userId,
                  msg.lockedBy,
                  msg.lockedAt,
                  msg.timeout
                );
              case LOCK_SUB_OUTPUT_SUBSCRIBE_FAILED:
                return lockSubscribeFailure(
                  lockId,
                  msg.errors
                );
              case LOCK_SUB_OUTPUT_LOCKED:
                return lockLocked(lockId, msg.lockedBy, msg.lockedAt);
              case LOCK_SUB_OUTPUT_UNLOCKED:
                return lockUnlocked(lockId);
              case LOCK_SUB_OUTPUT_TIMEOUT_UPDATED:
                return lockTimeoutUpdated(
                  lockId,
                  msg.userId,
                  msg.timeout
                );
              case LOCK_SUB_OUTPUT_USER_ADDED:
                return lockUserAdded(
                  lockId,
                  msg.id,
                  msg.username,
                  msg.number
                );
              case LOCK_SUB_OUTPUT_FAILED:
                return lockFailed(
                  lockId,
                  msg.error
                );
              case LOCK_SUB_OUTPUT_CRITICALLY_FAILED:
                return lockCriticallyFailed(
                  lockId,
                  msg.error
                );
            }
          })
        );
      })
    )
  );
};
