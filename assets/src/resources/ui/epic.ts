import { Observable } from "rxjs";
import { ignoreElements } from "rxjs/operators";

import { ActionTypes } from "../actions";

import { UiState } from "./reducer";

export default function (action$: Observable<ActionTypes>, state$: UiState): Observable<ActionTypes> {
  return action$.pipe(
    ignoreElements()
  );
};
