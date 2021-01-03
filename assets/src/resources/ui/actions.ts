import { FormsActionTypes, setErrors as fSetErrors } from "../shared/forms/actions";
import { UiForms } from "./types";
import { Errors } from "../../utils/forms";

export type UiActionTypes = FormsActionTypes<UiForms>;

export const setErrors = <K extends keyof UiForms>(formName: K, errors: Errors<UiForms[K]>) => fSetErrors(formName, errors);
