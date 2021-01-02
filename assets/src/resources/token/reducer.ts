import { FETCH_TOKEN, TokenActionTypes } from "./actions";
import { Token } from "./types";

interface TokenState {
};

const initialState: TokenState = {
};

export default function (state = initialState, action: TokenActionTypes): TokenState {
  switch (action.type) {
    default:
      return state;
  }
};
