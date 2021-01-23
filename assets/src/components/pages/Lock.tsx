import React from "react";
import { connect, ConnectedProps } from "react-redux";
import {
  RouteComponentProps
} from "react-router-dom";

import Root from "./Root";
import {
  Aside as LayoutAside,
  Section as LayoutSection
} from "../base/Layout";
import {
  Strong
} from "../base/Text";
import Modal from "../base/Modal";
import {
  Nav as FormNav
} from "../base/Form";
import Button from "../base/Button";
import Donut from "../base/Donut";
import Teleprompter, {
  Item as TeleprompterItem
} from "../base/Teleprompter";
import Form, {
  ConnectedField
} from "../shared/Form";

import { RootState } from "../../resources/reducer";
import { lockSubscribe, lockUnsubscribe } from "../../resources/locks/actions";
import { ui, locks } from "../../resources/selectors";
import {
  LockSettings,
  User,
  LOCK_STATE_UNINITIALIZED,
  LOCK_STATE_LOADING,
  LOCK_STATE_FAILED,
  LOCK_STATE_INITIALIZED,
  LOCK_STATE_SUCCESS
} from "../../resources/locks/types";

const FAKE_USERS = [
  { id: 1, colorNumber: 1, label: "aalice" },
  { id: 2, colorNumber: 39, label: "bbob" },
  { id: 3, colorNumber: 22, label: "mark" },
  { id: 4, colorNumber: 54, label: "john.doe" },
  { id: 5, colorNumber: 50, label: "pepe" },
  { id: 6, colorNumber: 8, label: "pepe" },
  { id: 7, colorNumber: 15, label: "pepe" }
];

const FAKE_SELECTED_ID = 4;

const DEFAULT_COLOR_NUMBER = 3;

const FAKE_TELEPROMPTER_ITEMS: Array<number> = [
      // <TeleprompterItem>
      //   <Strong colorNumber={54}>john.doe</Strong> released the lock after <Strong>5 seconds</Strong>
      // </TeleprompterItem>
      // <TeleprompterItem>
      //   <Strong>john.doe</Strong> acquired the lock
      // </TeleprompterItem>
      // <TeleprompterItem>
      //   <Strong>pepe</Strong> joined the lock
      // </TeleprompterItem>
      // <TeleprompterItem>
      //   <Strong>pepe</Strong> left the lock
      // </TeleprompterItem>
      // <TeleprompterItem>
      //   <Strong>pepe</Strong> left the lock
      // </TeleprompterItem>
      // <TeleprompterItem>
      //   <Strong>pepe</Strong> left the lock
      // </TeleprompterItem>
      // <TeleprompterItem>
      //   <Strong>pepe</Strong> left the lock
      // </TeleprompterItem>
      // <TeleprompterItem>
      //   <Strong>pepe</Strong> left the lock
      // </TeleprompterItem>
      // <TeleprompterItem>
      //   <Strong>pepe</Strong> left the lock
      // </TeleprompterItem>
];

type OwnProps = RouteComponentProps<{ lockId: string }> & {};

const connector = connect((state: RootState, { match: { params: { lockId } } }: OwnProps) => {
  return {
    lock: locks.selectLock(state, lockId),
    lockSettingsForm: ui.selectForm(state, "lockSettings")
  };
}, { lockSubscribe, lockUnsubscribe });

type Props = OwnProps & ConnectedProps<typeof connector>;

const UsernameField = ConnectedField<"lockSettings", "username">();

const serializeUsers = (users: Array<User>) => users.map(({ id, number, username }) => {
  return { id, colorNumber: number, label: username };
});

class Lock extends React.Component<Props> {
  componentDidMount() {
    const { lock, lockSubscribe, match: { params: { lockId } } } = this.props;

    if (lock.state === LOCK_STATE_INITIALIZED) {
      lockSubscribe(lockId, lock.username);
    }
  }

  componentWillUnmount() {
    const { lockUnsubscribe, match: { params: { lockId } } } = this.props;

    lockUnsubscribe(lockId);
  }

  componentDidUpdate() {
    const { lock, lockSubscribe, match: { params: { lockId } } } = this.props;

    if (lock.state === LOCK_STATE_INITIALIZED) {
      lockSubscribe(lockId, lock.username);
    }
  }

  render() {
    const { lock, lockSettingsForm, match: { params: { lockId } }, history, lockSubscribe } = this.props;
    let modal;
    let user;

    console.log("RENDERING LOCK", lock);

    if (lock.state === LOCK_STATE_LOADING ||
        lock.state === LOCK_STATE_UNINITIALIZED ||
        lock.state === LOCK_STATE_FAILED) {
      modal = (
        <Modal title="Lock Settings" onModalClose={() => history.push("/")}>
          <Form formName="lockSettings" form={lockSettingsForm} onSubmit={(settings: LockSettings) => lockSubscribe(lockId, settings.username)}>
            <UsernameField formName="lockSettings" label="Username" type="text" name="username" />

            <FormNav>
              <Button>Save</Button>
            </FormNav>
          </Form>
        </Modal>
      );
    }
    else if (lock.state === LOCK_STATE_SUCCESS) {
      const userTmp = lock.users.find(({ id }) => id === lock.userId);

      if (userTmp) {
        user = { colorNumber: userTmp.number, username: userTmp.username };
      }
    }
    else if (lock.state === LOCK_STATE_INITIALIZED) {
      user = { colorNumber: DEFAULT_COLOR_NUMBER, username: lock.username };
    }

    const users = lock.state === LOCK_STATE_SUCCESS ? serializeUsers(lock.users) : FAKE_USERS;
    const teleprompterItems = lock.state === LOCK_STATE_SUCCESS ? [] : FAKE_TELEPROMPTER_ITEMS;
    const selectedId = lock.state === LOCK_STATE_SUCCESS ? lock.lockedBy : FAKE_SELECTED_ID;

    return (
      <Root title={`Lock ${lockId}`} modal={modal} user={user}>
        <LayoutSection>
          <Donut items={users} selectedId={selectedId} />
        </LayoutSection>
        <LayoutAside>
          <Teleprompter itemsCount={3}>
            <TeleprompterItem>
              <Strong colorNumber={54}>john.doe</Strong> released the lock after <Strong>5 seconds</Strong>
            </TeleprompterItem>
            <TeleprompterItem>
              <Strong>john.doe</Strong> acquired the lock
            </TeleprompterItem>
            <TeleprompterItem>
              <Strong>pepe</Strong> joined the lock
            </TeleprompterItem>
            <TeleprompterItem>
              <Strong>pepe</Strong> left the lock
            </TeleprompterItem>
            <TeleprompterItem>
              <Strong>pepe</Strong> left the lock
            </TeleprompterItem>
            <TeleprompterItem>
              <Strong>pepe</Strong> left the lock
            </TeleprompterItem>
            <TeleprompterItem>
              <Strong>pepe</Strong> left the lock
            </TeleprompterItem>
            <TeleprompterItem>
              <Strong>pepe</Strong> left the lock
            </TeleprompterItem>
            <TeleprompterItem>
              <Strong>pepe</Strong> left the lock
            </TeleprompterItem>
          </Teleprompter>
        </LayoutAside>
      </Root>
    );
  }
};

export default connector(Lock);
