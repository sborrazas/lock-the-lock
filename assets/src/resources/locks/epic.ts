import { Action } from "redux";
import { Observable, merge } from "rxjs";
import { ofType } from "redux-observable";
import { map, mergeMap } from "rxjs/operators";

import {
  locks,
  SUCCESS,
  LOCK_SUB_OUTPUT_LOCKED,
  LOCK_SUB_OUTPUT_UNLOCKED,
  LOCK_SUB_OUTPUT_UPDATED,
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
  lockLocked,
  lockUnlocked,
  lockUpdated
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
              case LOCK_SUB_OUTPUT_LOCKED:
                return lockLocked(lockId, msg.locked_by, msg.locked_at);
              case LOCK_SUB_OUTPUT_UNLOCKED:
                return lockUnlocked(lockId);
              case LOCK_SUB_OUTPUT_UPDATED:
                return lockUpdated(
                  lockId,
                  msg.users,
                  msg.current_user,
                  msg.locked_by,
                  msg.timeout
                );
            }
          })
        );
      })
    )
  );
};
