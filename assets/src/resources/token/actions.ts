import { Action } from "redux";

import { Token } from "./types";

export const FETCH_TOKEN = "TOKEN__FETCH_TOKEN";
export const FETCH_TOKEN_SUCCESS = "TOKEN__FETCH_TOKEN_SUCCESS";

export interface FetchTokenAction extends Action {
  type: typeof FETCH_TOKEN;
};

export interface FetchTokenSuccessAction extends Action {
  type: typeof FETCH_TOKEN_SUCCESS;
  payload: Token;
};

export type TokenActionTypes = FetchTokenAction | FetchTokenSuccessAction;

export const fetchToken = (): TokenActionTypes => {
  return {
    type: FETCH_TOKEN
  };
};

export const fetchTokenSuccess = (token: Token): TokenActionTypes => {
  return {
    type: FETCH_TOKEN_SUCCESS,
    payload: token
  };
};
