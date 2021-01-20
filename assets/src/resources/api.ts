import { Observable, of } from "rxjs";
import { ajax, AjaxResponse } from "rxjs/ajax";
import { catchError, map } from "rxjs/operators";

import { NewLock, LockId } from "./locks/types";
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
  }
};

export const setToken = (token: Token) => {
  currentToken = token;
};
