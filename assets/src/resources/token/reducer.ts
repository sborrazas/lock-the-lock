import { FETCH_TOKEN, FETCH_TOKEN_SUCCESS, TokenActionTypes } from "./actions";
import { Token } from "./types";

export interface TokenState {
  fetching: boolean;
  token?: Token;
};

const initialState: TokenState = {
  fetching: false
};

export default function (state = initialState, action: TokenActionTypes): TokenState {
  switch (action.type) {
    case FETCH_TOKEN:
      return {
        ...state,
        fetching: true
      };
    case FETCH_TOKEN_SUCCESS:
      return {
        ...state,
        token: action.payload
      };
  default:
      return state;
  }
};
