import { Observable } from "rxjs";
import { ofType } from "redux-observable";
import { map, mergeMap } from "rxjs/operators";

import { setToken, token } from "../api";

import { Token } from "./types";

import { ActionTypes } from "../actions";

import { FETCH_TOKEN, FetchTokenAction, fetchTokenSuccess } from "./actions";

import { TokenState } from "./reducer";

export default (action$: Observable<ActionTypes>, state: TokenState): Observable<ActionTypes> => {
  return action$.pipe(
    ofType<ActionTypes, FetchTokenAction, FetchTokenAction["type"]>(FETCH_TOKEN),
    mergeMap((item: FetchTokenAction) => {
      return token.fetch().pipe(map((token: Token) => {
        setToken(token);

        return fetchTokenSuccess(token);
      }));
    })
  );
};
