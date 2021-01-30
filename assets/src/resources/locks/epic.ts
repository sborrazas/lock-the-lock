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
  LOCK_SUB_OUTPUT_TIMEDOUT,
  LOCK_SUB_OUTPUT_USER_ADDED,
  LOCK_SUB_OUTPUT_USER_REMOVED,
  LOCK_SUB_OUTPUT_TIMEOUT_UPDATED,
  LOCK_SUB_OUTPUT_FAILED,
  LOCK_SUB_OUTPUT_CRITICALLY_FAILED,
  LOCK_SUB_INPUT_LOCK,
  LOCK_SUB_INPUT_UNLOCK,
  LOCK_SUB_INPUT_UPDATE_TIMEOUT,
  LOCK_SUB_INPUT_EXIT,
  Response,
  LockSubInputMsg,
  LockSubOutputMsg
} from "../api";

import {
  CREATE,
  LOCK_SUBSCRIBE,
  LOCK_LOCK,
  LOCK_UNLOCK,
  LOCK_UPDATE_TIMEOUT,
  LOCK_UNSUBSCRIBE,
  CreateLockAction,
  LockSubscribeAction,
  LockLockAction,
  LockUnlockAction,
  LockUpdateTimeoutAction,
  LockUnsubscribeAction,
  createLockSuccess,
  createLockFailure,
  lockSubscribeSuccess,
  lockSubscribeFailure,
  lockLocked,
  lockUnlocked,
  lockTimedout,
  lockUserAdded,
  lockUserRemoved,
  lockTimeoutUpdated,
  lockFailed,
  lockCriticallyFailed
} from "./actions";
import { LocksState } from "./reducer";
import { NewLock, LockId } from "./types";

export default (action$: Observable<Action>, state: LocksState): Observable<Action> => {
  const wsInputObservable: Observable<LockSubInputMsg> = merge<LockSubInputMsg>(
    action$.pipe(
      ofType<Action, LockLockAction, typeof LOCK_LOCK>(LOCK_LOCK),
      map<LockLockAction, LockSubInputMsg>((action: LockLockAction) => {
        return {
          type: LOCK_SUB_INPUT_LOCK
        };
      })
    ),
    action$.pipe(
      ofType<Action, LockUnlockAction, typeof LOCK_UNLOCK>(LOCK_UNLOCK),
      map<LockUnlockAction, LockSubInputMsg>((action: LockUnlockAction) => {
        return {
          type: LOCK_SUB_INPUT_UNLOCK
        };
      })
    ),
    action$.pipe(
      ofType<Action, LockUpdateTimeoutAction, typeof LOCK_UPDATE_TIMEOUT>(LOCK_UPDATE_TIMEOUT),
      map<LockUpdateTimeoutAction, LockSubInputMsg>((action: LockUpdateTimeoutAction) => {
        return {
          type: LOCK_SUB_INPUT_UPDATE_TIMEOUT,
          timeout: action.payload.timeout
        };
      })
    ),
    action$.pipe(
      ofType<Action, LockUnsubscribeAction, typeof LOCK_UNSUBSCRIBE>(LOCK_UNSUBSCRIBE),
      map<LockUnsubscribeAction, LockSubInputMsg>((action: LockUnsubscribeAction) => {
        return {
          type: LOCK_SUB_INPUT_EXIT
        };
      })
    )
  );

  return merge<Action, Action>(
    action$.pipe(
      ofType<Action, CreateLockAction, typeof CREATE>(CREATE),
      mergeMap((item: CreateLockAction) => {
        return locks.create(item.payload).pipe(
          map((response: Response<NewLock, { id: LockId, username: string }>) => {
            if (response.type === SUCCESS) {
              return createLockSuccess(response.entity.id, response.entity.username);
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
              case LOCK_SUB_OUTPUT_TIMEDOUT:
                return lockTimedout(lockId);
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
              case LOCK_SUB_OUTPUT_USER_REMOVED:
                return lockUserRemoved(
                  lockId,
                  msg.id
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
