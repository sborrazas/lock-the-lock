import React from "react";
import { connect, ConnectedProps } from "react-redux";

import Form, {
  Field as FormField
} from "../shared/Form";
import {
  Nav as FormNav
} from "../base/Form";
import Button from "../base/Button";
import Modal from "../base/Modal";

import { RootState } from "../../resources/reducer";
import { createLock } from "../../resources/locks/actions";
import { Lock } from "../../resources/locks/types";
import { ui } from "../../resources/selectors";

import Home from "./Home";

const connector = connect((state: RootState) => {
  return {
    createLockForm: ui.selectForm(state, "createLock")
  };
}, { createLock });

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
};

const NewLock = ({ createLockForm, createLock }: Props) => {
  const modal = (
    <Modal title="Create Lock">
      <Form formName="createLock" form={createLockForm} onSubmit={(lock: Lock) => createLock(lock)}>
        <FormField formName="createLock" label="Username" type="text" name="username" />
        <FormField formName="createLock" label="Timed Lock" type="checkbox" name="is_timed" />
        <FormField formName="createLock" label="Timeout" type="timespan" name="timeout" />

        <FormNav>
          <Button>Create</Button>
        </FormNav>
      </Form>
    </Modal>
  );

  return (
    <Home modal={modal} />
  );
};

export default connector(NewLock);
