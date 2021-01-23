import React from "react";
import { connect, ConnectedProps } from "react-redux";
import {
  RouteComponentProps
} from "react-router-dom";

import Form, {
  ConnectedField
} from "../shared/Form";
import {
  Nav as FormNav
} from "../base/Form";
import Button from "../base/Button";
import Modal from "../base/Modal";

import { RootState } from "../../resources/reducer";
import { createLock } from "../../resources/locks/actions";
import { NewLock as NewLockT } from "../../resources/locks/types";
import { ui } from "../../resources/selectors";

import Home from "./Home";

type OwnProps = RouteComponentProps & {};

const connector = connect((state: RootState) => {
  return {
    createLockForm: ui.selectForm(state, "createLock")
  };
}, { createLock });

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = OwnProps & PropsFromRedux & {
};

const UsernameField = ConnectedField<"createLock", "username">();
const IsTimedField = ConnectedField<"createLock", "is_timed">();
const TimeoutField = ConnectedField<"createLock", "timeout">();

const NewLock = ({ createLockForm, createLock, history }: Props) => {
  let timeoutField;

  if (createLockForm.entity.is_timed) {
    timeoutField = (
      <TimeoutField formName="createLock" label="Timeout" type="timespan" name="timeout" />
    );
  }

  const modal = (
    <Modal title="Create Lock" onModalClose={() => history.push("/")}>
      <Form formName="createLock" form={createLockForm} onSubmit={(lock: NewLockT) => createLock(lock)}>
        <UsernameField formName="createLock" label="Username" type="text" name="username" />
        <IsTimedField formName="createLock" label="Timed Lock" type="checkbox" name="is_timed" />
        {timeoutField}

        <FormNav>
          <Button>Create</Button>
        </FormNav>
      </Form>
    </Modal>
  );

  return (
    <Home modal={modal} onModalClose={() => history.push("/")} />
  );
};

export default connector(NewLock);
