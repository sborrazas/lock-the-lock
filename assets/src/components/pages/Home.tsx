import React from "react";
import { connect, ConnectedProps } from "react-redux";

import Layout from "./Layout";
import { Landing as LayoutLanding } from "../base/Layout";
import List, {
  Item as ListItem
} from "../base/List";
import {
  Strong
} from "../base/Text";
import Button from "../base/Button";

import { RootState } from "../../resources/reducer";
import { createLock } from "../../resources/locks/actions";

const connector = connect((state: RootState) => { return {}; }, { createLock });

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
};

const Home = ({ createLock }: Props) => {
  return (
    <Layout title="Lock The Lock" isLanding>
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
        <Button cta onClick={ () => createLock("a") }>Create lock</Button>
      </LayoutLanding>
    </Layout>
  );
};

export default connector(Home);
