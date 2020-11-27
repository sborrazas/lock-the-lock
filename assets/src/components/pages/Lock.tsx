import React from "react";
import { connect, ConnectedProps } from "react-redux";
import {
  RouteComponentProps
} from "react-router-dom";

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

type Props = PropsFromRedux & RouteComponentProps<{ lockId: string }> & {};

const Home = ({ createLock, match: { params: { lockId } } }: Props) => {
  return (
    <Layout title={`Lock ${lockId}`}>
    </Layout>
  );
};

export default connector(Home);
