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
import FakeTeleprompter from "./Lock/FakeTeleprompter";
import FakeDonut from "./Lock/FakeDonut";
import Form, {
  Field as FormField
} from "../shared/Form";

import { RootState } from "../../resources/reducer";
import { lockInitialize, lockSubscribe, lockUnsubscribe } from "../../resources/locks/actions";
import { LockSettings as LockSettings } from "../../resources/ui/types";
import { ui, locks } from "../../resources/selectors";
import {
  LOCK_STATE_UNINITIALIZED,
  LOCK_STATE_INITIALIZED,
  LOCK_STATE_SUCCESS
} from "../../resources/locks/types";

type OwnProps = RouteComponentProps<{ lockId: string }> & {};

const connector = connect((state: RootState, { match: { params: { lockId } } }: OwnProps) => {
  return {
    lock: locks.selectLock(state, lockId),
    lockSettingsForm: ui.selectForm(state, "lockSettings")
  };
}, { lockInitialize, lockSubscribe, lockUnsubscribe });

type Props = OwnProps & ConnectedProps<typeof connector>;

const users = [ // Hard-coded data for now
  { id: 1, colorNumber: 1, label: "aalice" },
  { id: 2, colorNumber: 39, label: "bbob" },
  { id: 3, colorNumber: 22, label: "mark" },
  { id: 4, colorNumber: 54, label: "john.doe" },
  { id: 5, colorNumber: 50, label: "pepe" },
  { id: 6, colorNumber: 8, label: "pepe" },
  { id: 7, colorNumber: 15, label: "pepe" }
];

const selectedId = 4;

class Home extends React.Component<Props> {
  componentDidMount() {
    const { lock, lockSubscribe, match: { params: { lockId } } } = this.props;

    if (lock.state === LOCK_STATE_INITIALIZED) {
      lockSubscribe(lockId, lock.currentUser.username);
    }
  }

  componentWillUnmount() {
    const { lock, lockUnsubscribe, match: { params: { lockId } } } = this.props;

    if (lock.state === LOCK_STATE_SUCCESS) {
      lockUnsubscribe(lockId);
    }
  }

  render() {
    const { lock, lockSettingsForm, match: { params: { lockId } }, history, lockInitialize } = this.props;
    let donut;
    let teleprompter;
    let modal;

    if (lock.state !== LOCK_STATE_SUCCESS) {
      donut = (<FakeDonut />);
      teleprompter = (<FakeTeleprompter />);

      if (lock.state === LOCK_STATE_UNINITIALIZED) {
        modal = (
          <Modal title="Lock Settings" onModalClose={() => history.push("/")}>
            <Form formName="lockSettings" form={lockSettingsForm} onSubmit={(settings: LockSettings) => lockInitialize(lockId, settings.username)}>
              <FormField formName="createLock" label="Username" type="text" name="username" />

              <FormNav>
                <Button>Save</Button>
              </FormNav>
            </Form>
          </Modal>
        );
      }
    }
    else {
      donut = (<Donut items={users} selectedId={selectedId} />);
      teleprompter = (
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
      );
    }

    return (
      <Root title={`Lock ${lockId}`} modal={modal}>
        <LayoutSection>
          {donut}
        </LayoutSection>
        <LayoutAside>
          {teleprompter}
        </LayoutAside>
      </Root>
    );
  }
};

export default connector(Home);
