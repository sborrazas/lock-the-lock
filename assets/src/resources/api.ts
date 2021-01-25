import { Observable, of } from "rxjs";
import { ajax, AjaxResponse } from "rxjs/ajax";
import { catchError, map } from "rxjs/operators";
import { Socket } from "phoenix";

import { NewLock, LockId, User, UserId, LockSettings } from "./locks/types";
import { Token } from "./token/types";

import { Errors } from "../utils/forms";

export const SUCCESS = "SUCCESS";

export const ERROR = "ERROR";

export type Response<T, R> = {
  type: typeof SUCCESS;
  entity: R;
} | {
  type: typeof ERROR;
  errors: Errors<T>
};

let currentToken: Token;

export const token = {
  fetch: (): Observable<Token> => {
    return ajax({
      url: "/api/token",
      method: "GET"
    }).pipe(
      map<AjaxResponse, Token>(({ response, status }: AjaxResponse) => {
        return response as Token;
      })
    );
  }
};

export const LOCK_SUB_INPUT_LOCK = "LOCK_SUB_INPUT_LOCK";
export const LOCK_SUB_INPUT_UNLOCK = "LOCK_SUB_INPUT_UNLOCK";
export const LOCK_SUB_INPUT_UPDATE_TIMEOUT = "LOCK_SUB_INPUT_UPDATE_TIMEOUT";
export const LOCK_SUB_INPUT_EXIT = "LOCK_SUB_INPUT_EXIT";

type LockSubInputLockMsg = {
  type: typeof LOCK_SUB_INPUT_LOCK;
};

type LockSubInputUnlockMsg = {
  type: typeof LOCK_SUB_INPUT_UNLOCK;
};

type LockSubInputUpdateTimeoutMsg = {
  type: typeof LOCK_SUB_INPUT_UPDATE_TIMEOUT;
  timeout: number;
};

type LockSubInputExitMsg = {
  type: typeof LOCK_SUB_INPUT_EXIT;
};

export type LockSubInputMsg = LockSubInputLockMsg | LockSubInputUnlockMsg |
  LockSubInputUpdateTimeoutMsg | LockSubInputExitMsg;

export const LOCK_SUB_OUTPUT_SUBSCRIBE_SUCCESS = "LOCK_SUB_OUTPUT_SUBSCRIBE_SUCCESS";
export const LOCK_SUB_OUTPUT_SUBSCRIBE_FAILED = "LOCK_SUB_OUTPUT_SUBSCRIBE_FAILED";
export const LOCK_SUB_OUTPUT_LOCKED = "LOCK_SUB_OUTPUT_LOCKED";
export const LOCK_SUB_OUTPUT_UNLOCKED = "LOCK_SUB_OUTPUT_UNLOCKED";
export const LOCK_SUB_OUTPUT_USER_ADDED = "LOCK_SUB_OUTPUT_USER_ADDED";
export const LOCK_SUB_OUTPUT_USER_REMOVED = "LOCK_SUB_OUTPUT_USER_REMOVED";
export const LOCK_SUB_OUTPUT_TIMEOUT_UPDATED = "LOCK_SUB_OUTPUT_TIMEOUT_UPDATED";
export const LOCK_SUB_OUTPUT_FAILED = "LOCK_SUB_OUTPUT_FAILED";
export const LOCK_SUB_OUTPUT_CRITICALLY_FAILED = "LOCK_SUB_OUTPUT_CRITICALLY_FAILED";

type LockSubOutputSubscribeSuccessMsg = {
  type: typeof LOCK_SUB_OUTPUT_SUBSCRIBE_SUCCESS;
  userId: UserId;
  users: Array<User>;
  lockedBy: UserId | null;
  lockedAt: string | null;
  timeout: number;
};

type LockSubOutputSubscribeFailed = {
  type: typeof LOCK_SUB_OUTPUT_SUBSCRIBE_FAILED;
  errors: Errors<LockSettings>;
};

type LockSubOutputLockedMsg = {
  type: typeof LOCK_SUB_OUTPUT_LOCKED;
  lockedBy: UserId;
  lockedAt: string;
};

type LockSubOutputUnlockedMsg = {
  type: typeof LOCK_SUB_OUTPUT_UNLOCKED;
};

type LockSubOutputUserAddedMsg = {
  type: typeof LOCK_SUB_OUTPUT_USER_ADDED;
  id: UserId;
  username: string;
  number: number;
};

type LockSubOutputUserRemovedMsg = {
  type: typeof LOCK_SUB_OUTPUT_USER_REMOVED;
  id: UserId;
};

type LockSubOutputTimeoutUpdatedMsg = {
  type: typeof LOCK_SUB_OUTPUT_TIMEOUT_UPDATED;
  userId: UserId;
  timeout: number;
};

type LockSubOutputFailedMsg = {
  type: typeof LOCK_SUB_OUTPUT_FAILED;
  error: string;
};

type LockSubOutputCriticallyFailedMsg = {
  type: typeof LOCK_SUB_OUTPUT_CRITICALLY_FAILED;
  error: string;
};

export type LockSubOutputMsg = LockSubOutputSubscribeSuccessMsg | LockSubOutputSubscribeFailed |
  LockSubOutputLockedMsg | LockSubOutputUnlockedMsg | LockSubOutputTimeoutUpdatedMsg |
  LockSubOutputUserAddedMsg | LockSubOutputUserRemovedMsg |
  LockSubOutputFailedMsg | LockSubOutputCriticallyFailedMsg;

const BASE_URL = process.env.NODE_ENV === "development" ? "ws://localhost:4000" : "";

export const locks = {
  create: (lock: NewLock): Observable<Response<NewLock, { id: LockId; username: string; }>> => {
    return ajax({
      url: "/api/locks",
      method: "POST",
      headers: {
        "X-CSRF-Token": currentToken.token
      },
      body: lock
    }).pipe(
      map<AjaxResponse, Response<NewLock, { id: LockId, username: string }>>(({ response, status }: AjaxResponse) => {
        if (status >= 200 && status < 300) {
          return { type: SUCCESS, entity: response as { id: LockId, username: string } };
        }
        else {
          return { type: ERROR, errors: response as Errors<NewLock> };
        }
      }),
      catchError((error) => {
        const { status, response } = error;

        if (status === 422) {
          return of<Response<NewLock, { id: LockId; username: string; }>>({ type: ERROR, errors: response as Errors<NewLock> });
        }
        else {
          throw error;
        }
      })
    );
  },
  subscribe: (lockId: LockId, username: string, input: Observable<LockSubInputMsg>): Observable<LockSubOutputMsg> => {
    return new Observable((subject) => {
      const socket = new Socket(`${BASE_URL}/locks`, {
        // logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) })
      });
      const channel = socket.channel(`locks:${lockId}`, { username });

      channel
        .on("lock_locked", ({ user_id, timestamp }) => {
          subject.next({
            type: LOCK_SUB_OUTPUT_LOCKED,
            lockedBy: user_id,
            lockedAt: timestamp
          });
        });

      channel
        .on("lock_unlocked", () => {
          subject.next({
            type: LOCK_SUB_OUTPUT_UNLOCKED
          });
        });

      channel
        .on("user_added", ({ id, username, number }) => {
          subject.next({
            type: LOCK_SUB_OUTPUT_USER_ADDED,
            id,
            username,
            number
          });
        });

      channel
        .on("user_removed", ({ id }) => {
          subject.next({
            type: LOCK_SUB_OUTPUT_USER_REMOVED,
            id
          });
        });

      channel
        .on("timeout_updated", ({ user_id, timeout }) => {
          subject.next({
            type: LOCK_SUB_OUTPUT_TIMEOUT_UPDATED,
            userId: user_id,
            timeout
          });
        });

      channel.onError(({ reason }) => {
        // console.log("CHANNEL ERROR", reason);
      });

      channel
        .join()
        .receive("ok", ({ user_id, users, locked_by, locked_at, timeout }) => {
          subject.next({
            type: LOCK_SUB_OUTPUT_SUBSCRIBE_SUCCESS,
            userId: user_id,
            users: users,
            lockedBy: locked_by,
            lockedAt: locked_at,
            timeout
          });

          input.subscribe((inputMsg: LockSubInputMsg) => {
            switch (inputMsg.type) {
              case LOCK_SUB_INPUT_LOCK:
                channel.push("acquire_lock", {});
                break;
              case LOCK_SUB_INPUT_UNLOCK:
                channel.push("release_lock", {});
                break;
              case LOCK_SUB_INPUT_UPDATE_TIMEOUT:
                channel.push("update_timeout", { timeout: inputMsg.timeout });
                break;
              case LOCK_SUB_INPUT_EXIT:
                channel.push("exit_lock", {});
                break;
            }
          });
        })
        .receive("error", ({ reason, errors }) => {
          if (reason === "invalid") {
            subject.next({
              type: LOCK_SUB_OUTPUT_SUBSCRIBE_FAILED,
              errors
            });
          }
          else {
            subject.next({
              type: LOCK_SUB_OUTPUT_CRITICALLY_FAILED,
              error: reason
            });
          }
          socket.disconnect();
        })
        .receive("timeout", () => {
          subject.next({
            type: LOCK_SUB_OUTPUT_CRITICALLY_FAILED,
            error: "Timeout"
          });
        });

      socket.onError((reason) => {
        subject.next({
          type: LOCK_SUB_OUTPUT_CRITICALLY_FAILED,
          error: reason
        });
      });

      socket.connect();
    });
  }
};

export const setToken = (token: Token) => {
  currentToken = token;
};
