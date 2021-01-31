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
import UiLock from "../base/Lock";
import Teleprompter, {
  Item as TeleprompterItem
} from "../base/Teleprompter";
import Form, {
  ConnectedField
} from "../shared/Form";

import { RootState } from "../../resources/reducer";
import {
  lockSubscribe,
  lockLock,
  lockUnlock,
  lockUnsubscribe
} from "../../resources/locks/actions";
import { ui, locks } from "../../resources/selectors";
import {
  LockSettings,
  User,
  Log,
  LOCK_STATE_UNINITIALIZED,
  LOCK_STATE_LOADING,
  LOCK_STATE_FAILED,
  LOCK_STATE_INITIALIZED,
  LOCK_STATE_SUCCESS
} from "../../resources/locks/types";

const serializeUsers = (users: Array<User>) => users.map(({ id, number, username }) => {
  return { id, colorNumber: number, label: username };
});

const FAKE_USERS = [
  { id: 1, number: 1, username: "aalice" },
  { id: 2, number: 39, username: "bbob" },
  { id: 3, number: 22, username: "markus.dokus" },
  { id: 4, number: 54, username: "john" },
  { id: 5, number: 50, username: "susan" },
  { id: 6, number: 8, username: "Mr. x" },
  { id: 7, number: 15, username: "not.sure" },
  { id: 8, number: 31, username: "blueadam" },
  { id: 9, number: 34, username: "terminator" }
];

const SERIALIZED_FAKE_USERS = serializeUsers(FAKE_USERS);

const FAKE_SELECTED_ID = 4;

const DEFAULT_COLOR_NUMBER = 3;

const FAKE_LOGS: Array<Log> = [
  { user: FAKE_USERS[3], message: "released the lock after 5 seconds" },
  { user: FAKE_USERS[5], message: "acquired the lock" },
  { user: FAKE_USERS[2], message: "joined the lock" },
  { user: FAKE_USERS[5], message: "acquired the lock" },
  { user: FAKE_USERS[5], message: "acquired the lock" },
  { user: FAKE_USERS[5], message: "acquired the lock" },
  { user: FAKE_USERS[5], message: "acquired the lock" },
  { user: FAKE_USERS[5], message: "acquired the lock" }
];

type OwnProps = RouteComponentProps<{ lockId: string }> & {};

const connector = connect((state: RootState, { match: { params: { lockId } } }: OwnProps) => {
  return {
    lock: locks.selectLock(state, lockId),
    lockSettingsForm: ui.selectForm(state, "lockSettings")
  };
}, { lockSubscribe, lockLock, lockUnlock, lockUnsubscribe });

type Props = OwnProps & ConnectedProps<typeof connector>;

const UsernameField = ConnectedField<"lockSettings", "username">();

class Lock extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this._onLock = this._onLock.bind(this);
  }

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
    let label = "Locked by john";
    let logs: Array<Log> = FAKE_LOGS;

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

      if (lock.lockedBy) {
        const lockedByTmp = lock.users.find(({ id }) => id === lock.lockedBy);

        if (lockedByTmp) {
          label = lock.lockedBy === lock.userId ? "Unlock" : `Locked by ${lockedByTmp.username}`;
        }
      }
      else {
        label = "Lock";
      }

      logs = lock.logs;
    }
    else if (lock.state === LOCK_STATE_INITIALIZED) {
      user = { colorNumber: DEFAULT_COLOR_NUMBER, username: lock.username };
    }

    const users = lock.state === LOCK_STATE_SUCCESS ? serializeUsers(lock.users) : SERIALIZED_FAKE_USERS;
    const selectedId = lock.state === LOCK_STATE_SUCCESS ? lock.lockedBy : FAKE_SELECTED_ID;

    return (
      <Root title={`Lock ${lockId}`} modal={modal} user={user}>
        <LayoutSection>
          <UiLock
            label={label}
            lockUrl={window.location.href}
            items={users}
            selectedId={selectedId}
            onClick={this._onLock} />
        </LayoutSection>
        <LayoutAside>
          <Teleprompter itemsCount={logs.length}>
            {
              logs.map(({ user: { username, number }, message }, index) => {
                return (
                  <TeleprompterItem key={index}>
                    <Strong colorNumber={number}>{username}</Strong> {message}
                  </TeleprompterItem>
                );
              })
            }
          </Teleprompter>
        </LayoutAside>
      </Root>
    );
  }
  _onLock() {
    const { lock, match: { params: { lockId } }, lockLock, lockUnlock } = this.props;

    if (lock.state === LOCK_STATE_SUCCESS) {
      if (lock.lockedBy) {
        lockUnlock(lockId);
      }
      else {
        lockLock(lockId);
      }
    }
  }
};

export default connector(Lock);
