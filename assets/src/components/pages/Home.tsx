import React from "react";
import { connect, ConnectedProps } from "react-redux";

import Root from "./Root";
import {
  Landing as LayoutLanding
} from "../base/Layout";
import List, {
  Item as ListItem
} from "../base/List";
import {
  Strong
} from "../base/Text";
import Button from "../base/Button";

import { RootState } from "../../resources/reducer";

const connector = connect((state: RootState) => { return {}; }, {});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  modal?: React.ReactNode;
};

const Home = ({ modal }: Props) => {
  return (
    <Root title="Lock The Lock" isLanding modal={modal}>
      <LayoutLanding>
        <List>
          <ListItem>
            Only <Strong>one</Strong> user can have the lock
          </ListItem>
          <ListItem>
            Press the <Strong>Lock</Strong> button when <Strong>unlocked</Strong> to acquire the lock
          </ListItem>
          <ListItem>
            Press the <Strong>Unlock</Strong> button when to <Strong>release</Strong> the lock
          </ListItem>
        </List>
        <Button cta to="/create">Create lock</Button>
      </LayoutLanding>
    </Root>
  );
};

export default connector(Home);
