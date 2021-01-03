import { Observable, of } from "rxjs";
import { ajax, AjaxResponse } from "rxjs/ajax";
import { ignoreElements, catchError, map, mergeMap } from "rxjs/operators";

import { Lock } from "./locks/types";
import { Token } from "./token/types";

import { ActionTypes } from "./actions";

import { Errors } from "../utils/forms";

export const SUCCESS = "SUCCESS";

export const ERROR = "ERROR";

export type Response<T> = {
  type: typeof SUCCESS;
  entity: T;
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
  create: (lock: Lock): Observable<Response<Lock>> => {
    return ajax({
      url: "/api/locks",
      method: "POST",
      headers: {
        "X-CSRF-Token": currentToken.token
      },
      body: lock
    }).pipe(
      map<AjaxResponse, Response<Lock>>(({ response, status }: AjaxResponse) => {
        console.log("RESPONSE", response);
        if (status >= 200 && status < 300) {
          return { type: SUCCESS, entity: response as Lock };
        }
        else {
          return { type: ERROR, errors: response as Errors<Lock> };
        }
      }),
      catchError((error) => {
        const { status, response } = error;
        if (status === 422) {
          return of<Response<Lock>>({ type: ERROR, errors: response as Errors<Lock> });
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
