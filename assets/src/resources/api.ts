import { Observable, of } from "rxjs";
import { ajax, AjaxResponse } from "rxjs/ajax";
import { catchError, map } from "rxjs/operators";
import { webSocket } from "rxjs/webSocket";

import { NewLock, LockId, User } from "./locks/types";
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
export const LOCK_SUB_INPUT_UPDATE = "LOCK_SUB_INPUT_UPDATE";

type LockSubInputLockMsg = {
  type: typeof LOCK_SUB_INPUT_LOCK;
};

type LockSubInputUnlockMsg = {
  type: typeof LOCK_SUB_INPUT_UNLOCK;
};

type LockSubInputUpdateMsg = {
  type: typeof LOCK_SUB_INPUT_UPDATE;
};

export type LockSubInputMsg = LockSubInputLockMsg | LockSubInputUnlockMsg | LockSubInputUpdateMsg;

export const LOCK_SUB_OUTPUT_LOCKED = "LOCK_SUB_OUTPUT_LOCKED";
export const LOCK_SUB_OUTPUT_UNLOCKED = "LOCK_SUB_OUTPUT_UNLOCKED";
export const LOCK_SUB_OUTPUT_UPDATED = "LOCK_SUB_OUTPUT_UPDATED";
export const LOCK_SUB_OUTPUT_FAILED = "LOCK_SUB_OUTPUT_FAILED";
export const LOCK_SUB_OUTPUT_CRITICALLY_FAILED = "LOCK_SUB_OUTPUT_CRITICALLY_FAILED";

type LockSubOutputLockedMsg = {
  type: typeof LOCK_SUB_OUTPUT_LOCKED;
  lockId: LockId;
  locked_by: number;
  locked_at: string;
};

type LockSubOutputUnlockedMsg = {
  type: typeof LOCK_SUB_OUTPUT_UNLOCKED;
  lockId: LockId;
};

type LockSubOutputUpdatedMsg = {
  type: typeof LOCK_SUB_OUTPUT_UPDATED;
  lockId: LockId;
  users: Array<User>;
  current_user: User;
  locked_by: number | null;
  timeout: number;
};

type LockSubOutputFailedMsg = {
  type: typeof LOCK_SUB_OUTPUT_FAILED;
  lockId: LockId;
  error: string;
};

type LockSubOutputCriticallyFailedMsg = {
  type: typeof LOCK_SUB_OUTPUT_CRITICALLY_FAILED;
  lockId: LockId;
  error: string;
};

export type LockSubOutputMsg = LockSubOutputLockedMsg | LockSubOutputUnlockedMsg |
  LockSubOutputUpdatedMsg | LockSubOutputFailedMsg | LockSubOutputCriticallyFailedMsg;

export const locks = {
  create: (lock: NewLock): Observable<Response<NewLock, { id: LockId }>> => {
    return ajax({
      url: "/api/locks",
      method: "POST",
      headers: {
        "X-CSRF-Token": currentToken.token
      },
      body: lock
    }).pipe(
      map<AjaxResponse, Response<NewLock, { id: LockId }>>(({ response, status }: AjaxResponse) => {
        if (status >= 200 && status < 300) {
          return { type: SUCCESS, entity: response as { id: LockId } };
        }
        else {
          return { type: ERROR, errors: response as Errors<NewLock> };
        }
      }),
      catchError((error) => {
        const { status, response } = error;
        if (status === 422) {
          return of<Response<NewLock, { id: LockId }>>({ type: ERROR, errors: response as Errors<NewLock> });
        }
        else {
          throw error;
        }
      })
    );
  },
  subscribe: (lockId: LockId, username: string, input: Observable<LockSubInputMsg>): Observable<LockSubOutputMsg> => {
    const subject = webSocket<LockSubOutputMsg>(`/locks/${lockId}`);

    input.subscribe((inputMsg: LockSubInputMsg) => {
      console.log(inputMsg);
    });

    return subject.pipe(
      map((subjectMsg: LockSubOutputMsg) => {
        console.log(subjectMsg);

        return {
          type: LOCK_SUB_OUTPUT_UNLOCKED,
          lockId
        };
      })
    );
  }
};

export const setToken = (token: Token) => {
  currentToken = token;
};
