import { Action } from "redux";

import { Token } from "./types";

export const FETCH_TOKEN = "TOKEN__FETCH_TOKEN";

export interface FetchTokenAction extends Action {
  type: typeof FETCH_TOKEN;
};

export type TokenActionTypes = FetchTokenAction;

export function fetchToken(): TokenActionTypes {
  return {
    type: FETCH_TOKEN
  };
};
