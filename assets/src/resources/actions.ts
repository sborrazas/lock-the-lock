import { LocksActionTypes } from "./locks/actions";
import { UiActionTypes } from "./ui/actions";
import { TokenActionTypes } from "./token/actions";

export type ActionTypes = LocksActionTypes | UiActionTypes | TokenActionTypes;
