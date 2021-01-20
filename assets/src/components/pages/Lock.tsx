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
import Donut from "../base/Donut";
import Teleprompter, {
  Item as TeleprompterItem
} from "../base/Teleprompter";

import { RootState } from "../../resources/reducer";
import { lockSubscribe, lockUnsubscribe } from "../../resources/locks/actions";

type OwnProps = RouteComponentProps<{ lockId: string }> & {};

const connector = connect((state: RootState, { match: { params: { lockId } } }: OwnProps) => {
  return {
  };
}, { lockSubscribe, lockUnsubscribe });

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
    const { lockSubscribe, match: { params: { lockId } } } = this.props;

    lockSubscribe(lockId, "asdsa");
  }

  componentWillUnmount() {
    const { lockUnsubscribe, match: { params: { lockId } } } = this.props;

    lockUnsubscribe(lockId);
  }

  render() {
    const { match: { params: { lockId } } } = this.props;

    return (
      <Root title={`Lock ${lockId}`}>
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

export default connector(Home);
